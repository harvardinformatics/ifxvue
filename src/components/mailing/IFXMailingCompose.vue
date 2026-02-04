<script>
import { mapActions } from 'vuex'
import has from 'lodash/has'
import Editor from '@tinymce/tinymce-vue'
import IFXContactablesCombobox from '@/components/IFXContactablesCombobox'
import IFXPageHeader from '@/components/page/IFXPageHeader'
import IFXPageActionBar from '@/components/page/IFXPageActionBar'

export default {
  name: 'IFXMailingCompose',
  components: {
    Editor,
    IFXPageHeader,
    IFXContactablesCombobox,
    IFXPageActionBar,
  },
  props: {
    from: {
      type: String,
      required: false,
      default: null,
    },
    to: {
      type: String,
      required: false,
      default: null,
    },
    cc: {
      type: String,
      required: false,
      default: null,
    },
    bcc: {
      type: String,
      required: false,
      default: null,
    },
    subject: {
      type: String,
      required: false,
      default: null,
    },
    message: {
      type: String,
      required: false,
      default: null,
    },
    messageName: {
      type: String,
      required: false,
      default: null,
    },
    labManagerOrgSlugs: {
      type: Array,
      required: false,
      default: null,
    },
    invoicePrefix: {
      type: String,
      required: false,
      default: null,
    },
    recipients: {
      type: String,
      required: false,
      default: null,
    },
    recipientField: {
      type: String,
      required: false,
      default: null,
    },
  },
  data() {
    return {
      isValid: false,
      isLoading: true,
      fieldErrors: {
        from: null,
        to: null,
        cc: null,
        bcc: null,
        subject: null,
        message: null,
      },
      fromAddr: null,
      toList: [],
      ccList: [],
      bccList: [],
      localSubject: null,
      mailing: null,
      content: null,
      contactables: [],
    }
  },
  methods: {
    ...mapActions(['showMessage']),
    extractEmailAddress(str) {
      let result = str
      if (str && str.indexOf('<') !== -1) {
        const match = str.match(/<\s*([^ >]+)\s*>/)
        if (match) {
          result = match[1]
        }
      }
      return result
    },
    sendMailing() {
      if (!this.content) {
        this.showMessage('Please enter a message before sending.')
        return
      }
      const toMailStr = (contactable) => {
        if (contactable.name) {
          return `${contactable.name} <${contactable.detail}>`
        }
        return contactable.detail
      }
      const mailing = {
        message: this.content,
        subject: this.localSubject,
        fromstr: this.fromAddr,
        tostr: [...new Set(this.toList.map(toMailStr))].join(','),
      }
      if (this.ccList.length) {
        mailing.ccstr = [...new Set(this.ccList.map(toMailStr))].join(',')
      }
      if (this.bccList.length) {
        mailing.bccstr = [...new Set(this.bccList.map(toMailStr))].join(',')
      }
      this.$api.mailing
        .sendIfxMailing(mailing)
        .then((res) => this.showMessage(res))
        .catch((err) => {
          if (has(err, 'response') && has(err.response, 'data') && has(err.response.data, 'field_errors')) {
            this.fieldErrors = err.response.data.field_errors
          } else {
            this.showMessage(err)
          }
        })
    },
  },
  computed: {
    editorInit() {
      return {
        height: 300,
        menubar: false,
        statusbar: false,
        plugins:
          'advlist autolink lists link image charmap searchreplace visualblocks fullscreen preview anchor insertdatetime media code help wordcount table',
        toolbar:
          'undo redo | code | blocks fontfamily fontsize | bold italic | alignleft aligncenter alignright | bullist numlist outdent indent | help',
      }
    },
  },
  mounted() {
    const me = this
    const routeState = window.history.state || {}
    // Support props, query params, and history state (Vue Router 4 compatibility)
    const recipients = this.recipients || this.$route.query.recipients || routeState.recipients
    const recipientField = this.recipientField || this.$route.query.recipientField || routeState.recipientField
    const from = this.from || this.$route.query.from || routeState.from
    const to = this.to || this.$route.query.to || routeState.to
    const cc = this.cc || this.$route.query.cc || routeState.cc
    const bcc = this.bcc || this.$route.query.bcc || routeState.bcc
    const subject = this.subject || this.$route.query.subject || routeState.subject
    const message = this.message || this.$route.query.message || routeState.message

    if (message) {
      this.content = message
    }
    if (subject) {
      this.localSubject = subject
    }
    this.$api.contactables
      .getList()
      .then((result) => {
        this.contactables = result
        if (this.labManagerOrgSlugs) {
          this.$api.getBillingContacts(this.labManagerOrgSlugs, this.invoicePrefix)
            .then((res) => {
              const result2 = res.data
              const orgContactNotFound = []
              me.labManagerOrgSlugs.forEach((slug) => {
                const name = this.$api.organization.parseSlug(slug).name
                if (!result2.some((contactable) => contactable?.label?.indexOf(name) !== -1)) {
                  orgContactNotFound.push(name)
                }
              })
              if (recipientField) {
                const badFieldMessage = `An invalid recipient field was specified: ${recipientField}`
                switch (recipientField) {
                  case 'to':
                    me.toList = me.toList.concat(result2)
                    break
                  case 'cc':
                    me.ccList = me.ccList.concat(result2)
                    break
                  case 'bcc':
                    me.bccList = me.bccList.concat(result2)
                    break
                  default:
                    me.showMessage(badFieldMessage)
                }
              } else {
                me.toList = result2
              }
              this.isLoading = false
              if (orgContactNotFound.length) {
                const names = orgContactNotFound.join(', ')
                const message = `Unable to find lab manager contact for ${names}`
                me.showMessage(message)
              }
            })
            .catch((error) => {
              this.showMessage(error)
            })
        } else {
          this.isLoading = false
        }
        if (from) {
          this.fromAddr = from
        } else {
          this.fromAddr = this.$api.vars.appDefaultFromField || this.$api.auth.getCurrentUserRecord().primaryEmail
        }
        if (to) {
          to.split(',').forEach((ele) => {
            const email = this.extractEmailAddress(ele)
            const matches = this.contactables.filter((contactable) => contactable.detail === email)
            if (matches) {
              this.toList = this.toList.concat(matches)
            } else {
              this.toList.push({
                detail: email,
                label: email,
                text: email,
              })
            }
          })
        }
        if (cc) {
          cc.split(',').forEach((ele) => {
            const email = this.extractEmailAddress(ele)
            const matches = this.contactables.filter((contactable) => contactable.detail === email)
            if (matches) {
              this.ccList = this.ccList.concat(matches)
            } else {
              this.ccList.push({
                detail: email,
                label: email,
                text: email,
              })
            }
          })
        }
        if (bcc) {
          bcc.split(',').forEach((ele) => {
            const email = this.extractEmailAddress(ele)
            const matches = this.contactables.filter((contactable) => contactable.detail === email)
            if (matches) {
              this.bccList = this.bccList.concat(matches)
            } else {
              this.bccList.push({
                detail: email,
                label: email,
                text: email,
              })
            }
          })
        }
        if (recipients) {
          recipients.split(',').forEach((ele) => {
            const email = this.extractEmailAddress(ele)
            const matches = this.contactables.filter((contactable) => contactable.detail === email)
            if (matches) {
              if (recipientField) {
                const badFieldMessage = `An invalid recipient field was specified: ${recipientField}`
                switch (recipientField) {
                  case 'to':
                    this.toList = this.toList.concat(matches)
                    break
                  case 'cc':
                    this.ccList = this.ccList.concat(matches)
                    break
                  case 'bcc':
                    this.bccList = this.bccList.concat(matches)
                    break
                  default:
                    this.showMessage(badFieldMessage)
                }
              } else {
                this.toList = this.toList.concat(matches)
              }
            }
          })
        }
      })
      .catch((error) => {
        this.showMessage(error)
      })
    if (this.messageName) {
      this.$api.message.getList({ name: this.messageName }).then((result) => {
        if (result.length) {
          this.content = result[0].message
        }
      })
    }
  },
}
</script>

<template>
  <v-container v-if="!isLoading">
    <IFXPageHeader>
      <template #title>Compose Mailing</template>
      <template #content>Compose a new mailing</template>
    </IFXPageHeader>
    <v-container>
      <v-form v-model="isValid" id="mailing-compose-form" ref="mailingComposeForm">
        <v-text-field
          label="From"
          v-model="fromAddr"
          :rules="formRules.generic"
          :error-messages="fieldErrors.fromAddr"
          required
          class="required"
        ></v-text-field>
        <IFXContactablesCombobox
          ref="toCombobox"
          label="To:"
          required
          :fieldError="fieldErrors.toList"
          v-model="toList"
          :contactables="contactables"
        />
        <IFXContactablesCombobox
          ref="ccCombobox"
          label="Cc:"
          :fieldError="fieldErrors.ccList"
          v-model="ccList"
          :contactables="contactables"
        />
        <IFXContactablesCombobox
          label="Bcc:"
          :fieldError="fieldErrors.bccList"
          v-model="bccList"
          :contactables="contactables"
        />
        <v-text-field
          label="Subject"
          v-model="localSubject"
          :rules="formRules.generic"
          :error-messages="fieldErrors.subject"
          required
          class="required"
          hint="This will appear as the subject line in the email."
        ></v-text-field>
        <span>
          <Editor
            v-model="content"
            :init="editorInit"
            tinymceScriptSrc="https://cdnjs.cloudflare.com/ajax/libs/tinymce/6.8.4/tinymce.min.js"
          ></Editor>
        </span>
      </v-form>
      <div class="mt-3">
        <IFXPageActionBar :disabled="!isValid" btnType="submit" btnText="Send" @action="sendMailing"></IFXPageActionBar>
      </div>
    </v-container>
  </v-container>
</template>