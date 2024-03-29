<script>
import { mapActions } from 'vuex'
import * as has from 'lodash/has'
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
      default: null
    },
    recipients: {
      type: String,
      required: false,
      default: null
    },
    recipientField: {
      type: String,
      required: false,
      default: null
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
        message: null
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
      // If email is of the form Name <email>, extract the email.  Otherwise return
      let result = str
      if (str && str.indexOf('<') !== -1) {
        const match = str.match(/<\s*([^ >]+)\s*>/)
        if (match) { result = match[1] }
      }
      return result
    },
    sendMailing() {
      const toMailStr = (contactable) => {
        if (contactable.name) {
          return `${contactable.name} <${contactable.detail}>`
        }
        return contactable.detail
      }
      // Get mailing from vuex - this is where the mailing is stored throughout the composition process
      const mailing = {
        message: this.content,
        subject: this.localSubject,
        fromstr: this.fromAddr,
        tostr: [...new Set(this.toList.map(toMailStr))].join(',')
      }
      if (this.ccList.length) {
        mailing.ccstr = [...new Set(this.ccList.map(toMailStr))].join(',')
      }
      if (this.bccList.length) {
        mailing.bccstr = [...new Set(this.bccList.map(toMailStr))].join(',')
      }
      this.$api.mailing.sendIfxMailing(mailing)
        .then(res => this.showMessage(res))
        .catch(err => {
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
        plugins: [
          'advlist autolink lists link image charmap',
          'searchreplace visualblocks fullscreen',
          'print preview anchor insertdatetime media',
          'paste code help wordcount table'
        ],
        toolbar: 'undo redo | code | formatselect | bold italic | alignleft aligncenter alignright | bullist numlist outdent indent | help',
      }
    },
  },
  mounted() {
    const me = this
    if (this.message) {
      this.content = this.message
    }
    if (this.subject) {
      this.localSubject = this.subject
    }
    this.$api.contactables.getList()
      .then((result) => {
        this.contactables = result
        // If we're doing the lab manager notification thing
        if (this.labManagerOrgSlugs) {
          this.$api.contactables.getList({ role: 'Lab Manager', org_slugs: this.labManagerOrgSlugs })
            .then((result2) => {
              // If a contact for one of the orgs cannot be found, raise an error
              const orgContactNotFound = []
              me.labManagerOrgSlugs.forEach((slug) => {
                const name = this.$api.organization.parseSlug((slug)).name
                // Check if org name is in the contactable label
                if (!result2.some((contactable) => contactable.label.indexOf(name) !== -1)) {
                  orgContactNotFound.push(name)
                }
              })
              if (me.recipientField) {
                const badFieldMessage = `An invalid recipient field was specified: ${me.recipientField}`
                switch (me.recipientField) {
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
        } else {
          this.isLoading = false
        }
        if (this.from) {
          this.fromAddr = this.from
        } else {
          this.fromAddr = this.$api.vars.appDefaultFromField || this.$api.auth.getCurrentUserRecord().primaryEmail
        }
        if (this.to) {
          this.to.split(',').forEach((ele) => {
            const email = this.extractEmailAddress(ele)
            const matches = this.contactables.filter((contactable) => contactable.detail === email)
            if (matches) {
              this.toList = this.toList.concat(matches)
            } else {
              this.toList.push(
                {
                  detail: email,
                  label: email,
                  text: email
                }
              )
            }
          })
        }
        if (this.cc) {
          this.cc.split(',').forEach((ele) => {
            const email = this.extractEmailAddress(ele)
            const matches = this.contactables.filter((contactable) => contactable.detail === email)
            if (matches) {
              this.ccList = this.ccList.concat(matches)
            } else {
              this.ccList.push(
                {
                  detail: email,
                  label: email,
                  text: email
                }
              )
            }
          })
        }
        if (this.bcc) {
          this.bcc.split(',').forEach((ele) => {
            const email = this.extractEmailAddress(ele)
            const matches = this.contactables.filter((contactable) => contactable.detail === email)
            if (matches) {
              this.bccList = this.bccList.concat(matches)
            } else {
              this.bccList.push(
                {
                  detail: email,
                  label: email,
                  text: email
                }
              )
            }
          })
        }
        if (this.recipients) {
          this.recipients.split(',').forEach((ele) => {
            const email = this.extractEmailAddress(ele)
            const matches = this.contactables.filter((contactable) => contactable.detail === email)
            if (matches) {
              if (this.recipientField) {
                const badFieldMessage = `An invalid recipient field was specified: ${me.recipientField}`
                switch (this.recipientField) {
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
      .catch((error) => { this.showMessage(error) })
    if (this.messageName) {
      this.$api.message.getList({ name: this.messageName })
        .then((result) => {
          if (result.length) {
            this.content = result[0].message
          }
        })
    }
  }
}
</script>

<template>
  <v-container v-if="!isLoading">
    <IFXPageHeader>
      <template #title>Compose Mailing</template>
      <template #content>Compose a new mailing</template>
    </IFXPageHeader>
    <v-container>
    <v-form v-model='isValid' id="mailing-compose-form" ref="mailingComposeForm">
      <v-text-field
        label="From"
        v-model="fromAddr"
        :rules="formRules.generic"
        :error-messages="fieldErrors.fromAddr"
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
        ></Editor>
      </span>
    </v-form>
    <IFXPageActionBar
      :disabled='false'
      btnType='submit'
      btnText='Send'
      @action="sendMailing"
    >
    </IFXPageActionBar>
    </v-container>
  </v-container>
</template>
