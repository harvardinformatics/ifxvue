<template>
  <v-dialog v-model="isActiveLocal" :max-width="maxWidth" persistent>
    <v-card>
      <v-card-title class="headline">Expense Code Authorization Email</v-card-title>
      <v-card-text>
        <v-text-field
          v-model="emailAddress"
          label="Enter the email address of the expense code approver"
          :rules="formRules.email"
          required
        ></v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <IFXButton @action="cancel" btnType="cancel"></IFXButton>
        <IFXButton @action="confirm" btnType="submit"></IFXButton>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import IFXPerson from './user/IFXPerson'
import IFXOrganization from './organization/IFXOrganization'

// Dialog that prompts for the email address of a person who can
// Get/approve an expense code. Defaults to the lab manager for
// the user's primary affiliation organization
export default {
  name: 'IFXExpenseCodeAuthDialog',
  props: {
    facilityName: {
      type: String,
      required: true,
    },
    product: {
      type: Object,
      required: true,
    },
    user: {
      type: IFXPerson,
      required: true,
    },
    isActive: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      emailAddress: '',
    }
  },
  mounted() {
    if (this.user.primaryAffiliation && this.user.primaryAffiliation.organization) {
      console.log(this.user.primaryAffiliation.organization)
    }
  },
  computed: {
    isActiveLocal: {
      get() {
        return this.isActive
      },
      set(isActive) {
        this.$emit('update:isActive', isActive)
      },
    },
  },
  methods: {
    cancel() {
      this.emailAddress = ''
      this.$emit('cancel')
      this.isActiveLocal = false
    },
    confirm() {
      this.$emit('input', this.emailAddress)
      this.isActiveLocal = false
    },
    maxWidth() {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs':
          return 220
        case 'sm':
          return 400
        case 'md':
          return 500
        case 'lg':
          return 600
        case 'xl':
          return 800
        default:
          return 320
      }
    },
  },
}
</script>

<style scoped lang="scss"></style>
