<template>
  <v-dialog v-model="isActiveLocal" :max-width="maxWidth()" persistent>
    <v-card>
      <v-card-title class="headline">Request Expense Code</v-card-title>
      <v-card-subtitle class="text-subtitle-1">
        {{ `Request an Expense Code via email from the lab manager(s) for ${organization.name}` }}
      </v-card-subtitle>
      <v-card-text>
        <v-combobox
          v-model="selected"
          :items="items"
          item-text="name"
          item-value="detail"
          :search-input.sync="search"
          @change="clearSearch"
          :label="label | capitalizeFirstLetter"
          chips
          clearable
          multiple
          hide-selected
          item-disabled="false"
          return-object
          :menu-props="{ closeOnContentClick: true }"
          :required="true"
          :error-messages="errorMessage"
          no-data-text="No new results match that query."
          :class="{ required: required }"
        >
          <!-- Display the icons in different colors, based on their contactable type -->
          <template #item="{item}">
            <v-icon :color="item.contact.color">{{ item.contact.icon }}</v-icon>
            <v-list-item v-text="item.name"></v-list-item>
          </template>
          <template #selection="{item}">
            <v-chip color="transparent" close @click:close="removeRecipient(item)">
              <v-icon :color="item.contact.color" class="mr-2">{{ item.contact.icon }}</v-icon>
              {{ item.name }}
            </v-chip>
          </template>
        </v-combobox>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <IFXButton @action="cancel" btnType="close" btnText="Cancel"></IFXButton>
        <IFXButton @action="confirm" btnType="submit" btnText="Send Request"></IFXButton>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
// import IFXOrganization from './organization/IFXOrganization'
// import IFXContact from './contact/IFXContact'

// Dialog that prompts for the email addresses of people who can
// Get/approve an expense code. The user can select from the list of
// lab manager(s) for the user's primary affiliation organization
// and/or add additional emails
export default {
  name: 'IFXExpenseCodeAuthDialog',
  props: {
    facilityName: {
      type: String,
      required: true,
    },
    product: {
      type: String,
      required: true,
    },
    user: {
      type: Object,
      required: true,
    },
    organization: {
      type: Object,
      required: true,
    },
    isActive: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      selected: [],
      items: [],
      search: '',
    }
  },
  async mounted() {
    if (this.organization) {
      const allOrgs = await this.$api.organization.getList()
      const theOrg = allOrgs.find((org) => org.name === this.organization.name)

      if (theOrg && theOrg.contacts) {
        this.items = theOrg.contacts.filter((contact) => contact.role === 'lab_manager' && contact.type === 'Email')
        console.log(this.items)
      }
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
      this.selected = ''
      this.$emit('cancel')
      this.isActiveLocal = false
    },
    confirm() {
      this.$emit('close')
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
    clearSearch() {
      this.search = null
    },
    removeRecipient(item) {
      const index = this.selected.findIndex((address) => address.detail === item.detail)
      if (index !== -1) {
        this.selected.splice(index, 1)
      }
    },
  },
}
</script>

<style scoped lang="scss"></style>
