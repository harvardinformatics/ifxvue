<script>
import { mapActions } from 'vuex'
import * as has from 'lodash/has'
import IFXContactablesCombobox from '@/components/IFXContactablesCombobox'
import IFXTextEditor from '@/components/IFXTextEditor'

export default {
  name: 'IFXMailingCompose',
  components: {
    IFXTextEditor,
    IFXContactablesCombobox
  },
  props: {
    item: {
      type: Object,
      required: false,
      default: null
    }
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
    sendMailing() {
      // Get mailing from vuex - this is where the mailing is stored throughout the composition process
      const mailing = this.$store.getters['mailing/serializedMailing']
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
    loadPreviousMailing(item) {
      return this.$store.dispatch('mailing/loadMailing', item)
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
    },
    from: {
      get() {
        return this.$store.getters['mailing/from']
      },
      set(value) {
        const payload = { key: 'from', value }
        this.$store.dispatch('mailing/setValue', payload)
      }
    }
  },
  mounted() {
    this.isLoading = true
    this.from = this.$api.vars.appDefaultFromField || this.$api.auth.getCurrentUserRecord().primaryEmail
    if (this.item) {
      this.loadPreviousMailing(this.item)
    }
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
      <v-text-field
        label="From"
        v-model="from"
        :rules='formRules.generic'
        :error-messages="fieldErrors.from"
        class="required"
      ></v-text-field>
      <IFXContactablesCombobox
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
    <div>
      <IFXButton :disabled='false' btnType='submit' btnText='Send' class="mt-5" @action="sendMailing"/>
    </div>
    </v-container>
  </v-container>
</template>