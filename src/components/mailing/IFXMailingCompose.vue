<script>
import { mapActions } from 'vuex'
import * as has from 'lodash/has'
import IFXCombobox from '@/components/IFXCombobox'
import IFXTextEditor from '@/components/IFXTextEditor'

export default {
  name: 'IFXMailingCompose',
  components: {
    IFXTextEditor,
    IFXCombobox
  },
  data() {
    return {
      isValid: false,
      isLoading: false,
      fieldErrors: {
        from: null,
        to: null,
        cc: null,
        bcc: null,
        subject: null,
        message: null
      },
      recipients: [
        {
          label: 'from',
          required: true,
          isSearchDisabled: true
        },
        {
          label: 'to',
          required: true,
          isSearchDisabled: false
        },
        {
          label: 'cc',
          required: false,
          isSearchDisabled: false
        },
        {
          label: 'bcc',
          required: false,
          isSearchDisabled: false
        }
      ],
    }
  },
  methods: {
    ...mapActions(['showMessage']),
    // TODO: this endpoint is not functional
    sendMailing() {
      // Get mailing from vuex - this is where the mailing is stored throughout the composition process
      const mailing = this.$store.getters['mailing/subject']
      this.$api.sendIfxMailing(mailing)
        .then(res => this.showMessage(res))
        .catch(err => {
          if (has(err, 'response') && has(err.response, 'data') && has(err.response.data, 'field_errors')) {
            this.fieldErrors = err.response.data.field_errors
          } else {
            this.showMessage(err)
          }
        })
    },
    getMailingBody() {
      return this.$store.getters['mailing/message']
    },
    setMailingBody(value) {
      const payload = { key: 'message', value }
      this.$store.dispatch('mailing/setValue', payload)
    }
  },
  computed: {
    title() {
      return 'Compose Mailing'
    },
    description() {
      return 'Compose a new mailing.'
    },
    subject: {
      get() {
        return this.$store.getters['mailing/subject']
      },
      set(value) {
        const payload = { key: 'subject', value }
        this.$store.dispatch('mailing/setValue', payload)
      }
    }
  },
  mounted() {
    this.isLoading = true
    this.$nextTick(() => this.isLoading = false)
  }
}
</script>

<template>
  <v-container v-if="!isLoading">
    <IFXPageHeader>
      <template #title>{{title}}</template>
      <template #content>{{description}}</template>
      <template #actions>
        <IFXButton btnType='add' btnText='Load Mailing' @action="rtr.push({name: 'MailingList' })"/>
      </template>
    </IFXPageHeader>
    <v-container>
    <v-form v-model='isValid' id="mailing-compose-form" ref="mailingComposeForm">
      <IFXCombobox
        v-for='r in recipients'
        :label='r.label'
        :key='r.label'
        :required="r.required"
        :fieldError='fieldErrors[r.label]'
        :isSearchDisabled='r.isSearchDisabled'
      />
      <v-text-field
        label="Subject"
        v-model="subject"
        :rules='formRules.generic'
        :error-messages="fieldErrors.subject"
        required
        class="required"
        hint="This will appear as the subject line in the email."
      ></v-text-field>
      <span>
        <v-col class='text-right'>
          <IFXButton btnType='add' btnColor='secondary' btnText='Load Message Body' @action="rtr.push({name: 'IFXMessageList' })"/>
        </v-col>
        <IFXTextEditor :getText="getMailingBody" :setText="setMailingBody"/>
      </span>
    </v-form>
      <IFXButton :disabled='false' btnType='submit' btnText='Send' class="mt-5" @action="sendMailing"/>
    </v-container>
  </v-container>
</template>
