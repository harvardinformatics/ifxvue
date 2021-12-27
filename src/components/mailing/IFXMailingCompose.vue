<script>
import { mapActions } from 'vuex'
import * as has from 'lodash/has'
import Editor from '@tinymce/tinymce-vue'
import IFXContactablesCombobox from '@/components/IFXContactablesCombobox'
import IFXPageHeader from '@/components/page/IFXPageHeader'
import IFXButton from '@/components/IFXButton'

export default {
  name: 'IFXMailingCompose',
  components: {
    Editor,
    IFXPageHeader,
    IFXButton,
    IFXContactablesCombobox,
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
    messageName: {
      type: String,
      required: false,
      default: null,
    },
    theapiobj: {
      type: Object,
      required: false,
      default: null
    }
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
      subject: null,
      message: null,
      mailing: null,
      content: null,
      contactables: [],
    }
  },
  methods: {
    ...mapActions(['showMessage']),
    sendMailing() {
      const toMailStr = (contactable) => {
        if (contactable.name) {
          return `${contactable.name} <${contactable.detail} >`
        }
        return contactable.detail
      }
      // Get mailing from vuex - this is where the mailing is stored throughout the composition process
      const mailing = {
        message: this.content,
        subject: this.subject,
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
          'searchreplace visualblocks code fullscreen',
          'print preview anchor insertdatetime media',
          'paste code help wordcount table'
        ],
        toolbar: 'undo redo | formatselect | bold italic | alignleft aligncenter alignright | bullist numlist outdent indent | help',
        // setup: editor => { editor.on('init', () => this.initCallback()) }
      }
    },
  },
  mounted() {
    this.$api.contactables.getList()
      .then((result) => {
        this.contactables = result
        this.isLoading = false
        if (this.from) {
          this.fromAddr = this.from
        } else {
          this.fromAddr = this.$api.vars.appDefaultFromField || this.$api.auth.getCurrentUserRecord().primaryEmail
        }
        if (this.to) {
          this.to.split(',').forEach((ele) => {
            const matches = this.contactables.filter((contactable) => contactable.detail === ele)
            if (matches) {
              this.toList = matches
            } else {
              this.toList.push(
                {
                  detail: ele,
                  label: ele,
                  text: ele
                }
              )
            }
          })
        }
        if (this.cc) {
          this.cc.split(',').forEach((ele) => {
            const matches = this.contactables.filter((contactable) => contactable.detail === ele)
            if (matches) {
              this.ccList = matches
            } else {
              this.ccList.push(
                {
                  detail: ele,
                  label: ele,
                  text: ele
                }
              )
            }
          })
        }
        if (this.bcc) {
          this.bcc.split(',').forEach((ele) => {
            const matches = this.contactables.filter((contactable) => contactable.detail === ele)
            if (matches) {
              this.bccList = matches
            } else {
              this.bccList.push(
                {
                  detail: ele,
                  label: ele,
                  text: ele
                }
              )
            }
          })
        }
      })
      .catch((error) => { this.showMessage(error) })
    if (this.messageName) {
      this.$api.message.getList({ name: this.messageName })
        .then((result) => {
          this.message = result[0]
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
      <template #actions>
        <IFXButton btnType='add' btnText='Load message template' />
      </template>
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
        v-model="subject"
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
    <div>
      <IFXButton :disabled='false' btnType='submit' btnText='Send' class="mt-5" @action="sendMailing"/>
    </div>
    </v-container>
  </v-container>
</template>
