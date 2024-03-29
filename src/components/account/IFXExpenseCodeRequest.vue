<script>
// Dialog that prompts for the email addresses of people who can
// Get/approve an expense code. The user can select from the list of
// lab manager(s) for the user's primary affiliation organization
// and/or add additional emails
export default {
  name: 'IFXExpenseCodeRequest',
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
      emailAddresses: [],
      items: [],
      search: '',
    }
  },
  async mounted() {
    if (this.organization) {
      const orgTrees = this.organization.org_tree ? [this.organization.org_tree] : ['Harvard']
      const params = { orgTrees, rank: this.organization.rank }
      const orgs = await this.$api.organization.getList(params)

      if (orgs.length) {
        const theOrg = orgs[0]
        if (theOrg && theOrg.contacts) {
          this.items = theOrg.contacts.filter((contact) => contact.role === 'lab_manager' && contact.type === 'Email')
        }
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
      this.emailAddresses = []
      this.$emit('cancel')
      this.isActiveLocal = false
    },
    async confirm() {
      // Handle both objects and strings since v-combobox always returns the full object
      const emails = this.emailAddresses.map((item) => (typeof item === 'object' ? item.detail : item)).join(',')
      const params = {
        organization: this.organization.slug,
        facility: this.facilityName,
        product: this.product,
        emails,
      }
      // Send off the email addresses and then close ourselves
      await this.$api.expenseCodeRequest
        .create(params)
        .then((response) => {
          this.$emit('close', response)
          this.isActiveLocal = false
        })
        .catch((error) => {
          this.$emit('error', error)
        })
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
      const index = this.emailAddresses.findIndex((address) => address.detail === item.detail)
      if (index !== -1) {
        this.emailAddresses.splice(index, 1)
      }
    },
    isContactableObj(item) {
      if (typeof item === 'object' && typeof item.contact === 'object') {
        // If an object, make sure it a contact object with slug and color
        return !!item.contact.slug && !!item.contact.color
      }
      return false
    },
  },
}
</script>

<template>
  <v-dialog v-model="isActiveLocal" :max-width="maxWidth()" persistent>
    <v-card>
      <v-card-title class="headline">Request Expense Code</v-card-title>
      <v-card-subtitle class="text-subtitle-1">
        {{ `Request an Expense Code from the lab manager(s) for ${organization.name}` }}
      </v-card-subtitle>
      <v-card-text>
        <v-combobox
          v-model="emailAddresses"
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
          :menu-props="{ closeOnContentClick: true }"
          :required="true"
          :error-messages="errorMessage"
          :class="{ required: required }"
        >
          <template #item="{item}">
            <v-icon :color="item.contact.color">{{ item.contact.icon }}</v-icon>
            <v-list-item v-text="item.name"></v-list-item>
          </template>
          <template #selection="{item}">
            <v-chip v-if="isContactableObj(item)" color="transparent" close @click:close="removeRecipient(item)">
              <v-icon :color="item.contact.color" class="mr-2">
                {{ item.contact.icon }}
              </v-icon>
              {{ item.name }}
            </v-chip>
            <v-chip v-else close @click:close="removeRecipient(item)">{{ item }}</v-chip>
          </template>
          <template v-slot:no-data>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>
                  <p>
                    Enter an email address and press
                    <kbd>return</kbd>
                  </p>
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </template>
        </v-combobox>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <IFXButton @action="cancel" btnType="cancel"></IFXButton>
        <IFXButton
          @action="confirm"
          btnType="submit"
          btnText="Send Request"
          :disabled="!emailAddresses.length"
        ></IFXButton>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped lang="scss"></style>
