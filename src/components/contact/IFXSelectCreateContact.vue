<script>
import IFXItemSelectableMixin from '@/components/item/IFXItemSelectableMixin'

export default {
  name: 'IFXSelectCreateContact',
  mixins: [IFXItemSelectableMixin],
  props: {
    allRoles: {
      type: Array,
      required: false,
      default: () => [
        { name: 'Additional Email', editable: true },
        { name: 'Work Phone', editable: true },
        { name: 'Additional Phone', editable: true },
        { name: 'Additional Contact', editable: true },
      ],
    },
    filterRoles: {
      type: Boolean,
      required: false,
      default: true,
    },
  },
  data() {
    return {
      contactType: null,
      search: '',
      newContacts: [],
      isValid: false,
      createNewSelected: false,
      newContactDetail: null,
    }
  },
  mounted() {},
  computed: {
    // Computed get/set to handle empty contact objects
    selectedContact: {
      get() {
        // Only return contact if it has a real id or detail
        const contact = this.itemLocal.contact
        if (contact?.id || contact?.detail) {
          return contact
        }
        return null
      },
      set(value) {
        this.itemLocal.contact = value
      }
    },
    isContactSelected() {
      return this.selectedContact?.detail || this.createNewSelected
    },
    appropriateRoles() {
      // We assume that the type and the role name both contain the same case-sensitive value
      return this.allRoles.filter(
        (role) => role.editable
          && (this.filterRoles ? role.name.includes(this.itemLocal.contact?.type) || role.name === 'Additional Contact' : true)
      )
    },
    radioIsDisabled() {
      return !!this.itemLocal.contact?.id
    },
    allContacts() {
      return this.allItems.concat(this.newContacts)
    },
    emailRules() {
      return this.formRules.email.concat(this.detailIsUnique)
    },
  },
  methods: {
    checkValidForm() {
      this.$emit('check-valid-form')
    },
    createNew() {
      // This is a new contact. Create the object and assume Email type
      this.newContactDetail = this.search
      const contact = this.$api.contact.create({ detail: this.newContactDetail })
      contact.type = 'Email'
      contact._tempId = `new-${Date.now()}` // Temporary ID for new contacts
      this.itemLocal.contact = contact
      if (this.newContactDetail) {
        // Only save contact if there is a detail value
        this.newContacts.push(contact)
      }
      this.createNewSelected = true
      this.$nextTick(() => {
        this.$refs.form.validate()
      })
    },
    switchToSearch() {
      this.createNewSelected = false
      this.search = null
      // Clear the selection by setting to a fresh empty contact
      this.itemLocal.contact = this.$api.contact.create()
    },
    contactTypeChange() {
      this.itemLocal.role = null
      this.$nextTick(() => {
        this.$refs.form.validate()
      })
    },
    getContactIcon(contact) {
      if (contact?.type === 'Email') {
        return 'mdi-email-newsletter'
      }
      if (contact?.type === 'Phone') {
        return 'mdi-phone-classic'
      }
      return 'mdi-help-circle'
    },
    detailIsUnique(v) {
      return (
        (v && v.length && this.allItems.every((contact) => contact.detail !== v))
        || 'Contact information cannot be empty and must be unique'
      )
    },
    selectContact() {
      this.search = ''
      this.$nextTick(() => {
        if (this.$refs.form) {
          this.$refs.form.validate()
        }
      })
    },
    getItemValue(item) {
      return item?.id ?? item?._tempId ?? item?.detail
    },
  },
  watch: {
    isValid(valid) {
      this.$emit('update:valid', valid)
    },
  },
}
</script>

<template>
  <v-container fluid v-if="!isLoading" class="pa-0">
    <v-row align="center" class="mb-4">
      <v-col :cols="createNewSelected ? 8 : 9">
        <v-autocomplete
          v-show="!createNewSelected"
          v-model="selectedContact"
          label="Search for an existing contact"
          :items="allContacts"
          item-title="detail"
          :item-value="getItemValue"
          return-object
          auto-select-first
          clearable
          clear-icon="mdi-close-circle"
          hide-selected
          v-model:search="search"
          @update:modelValue="selectContact"
          data-cy="select-contact"
          :disabled="createNewSelected"
          density="comfortable"
          no-data-text="No contacts found"
        >
          <template v-slot:selection="{ item }">
            <v-chip size="small" color="primary">
              <v-icon start size="small">{{ getContactIcon(item) }}</v-icon>
              {{ item.detail }}
            </v-chip>
          </template>
          <template v-slot:item="{ item, props }">
            <v-list-item v-bind="props" :title="item.detail" :subtitle="item.type">
              <template v-slot:prepend>
                <v-icon>{{ getContactIcon(item) }}</v-icon>
              </template>
            </v-list-item>
          </template>
        </v-autocomplete>
        <div v-if="createNewSelected" class="text-body-1">
          Creating new contact
        </div>
      </v-col>
      <v-col :cols="createNewSelected ? 4 : 3">
        <v-btn
          color="primary"
          @click="createNew"
          v-if="!createNewSelected"
          block
          class="text-none"
        >
          Create New
        </v-btn>
        <v-btn
          variant="outlined"
          color="secondary"
          @click="switchToSearch"
          v-else
          block
          class="text-none"
        >
          Search
        </v-btn>
      </v-col>
    </v-row>

    <v-row v-if="isContactSelected" density="compact" class="mb-4">
      <v-col>
        <v-radio-group
          v-model="itemLocal.contact.type"
          inline
          :disabled="radioIsDisabled"
          @update:modelValue="contactTypeChange"
          hide-details
        >
          <template v-slot:label>
            <span v-if="!itemLocal.contact.id">Select a </span>
            <span>Contact type</span>
          </template>
          <v-radio label="Email" value="Email" data-cy="select-contact-email" />
          <v-radio label="Phone" value="Phone" data-cy="select-contact-phone" />
        </v-radio-group>
      </v-col>
    </v-row>

    <v-form ref="form" v-model="isValid" v-if="isContactSelected">
      <v-row density="compact">
        <v-col cols="12" sm="6" class="pr-sm-2">
          <v-autocomplete
            v-model="itemLocal.role"
            :items="appropriateRoles"
            :error-messages="errors['role']"
            :rules="formRules.generic"
            item-title="name"
            item-value="name"
            label="Role"
            required
            data-cy="select-role"
            density="comfortable"
            no-data-text="No roles available"
          />
        </v-col>
        <v-col cols="12" sm="6" class="pl-sm-2">
          <v-text-field
            v-if="itemLocal.contact.type === 'Email'"
            v-model.trim="itemLocal.contact.detail"
            autocomplete="new-password"
            :error-messages="errors['contacts.detail']"
            :rules="formRules.email"
            label="Email"
            required
            :disabled="!!itemLocal.contact.id"
            data-cy="role-email"
            density="comfortable"
          />
          <v-text-field
            v-if="itemLocal.contact.type === 'Phone'"
            v-model.trim="itemLocal.contact.detail"
            autocomplete="new-password"
            :error-messages="errors['contacts.detail']"
            :rules="formRules.generic"
            label="Phone"
            required
            :disabled="!!itemLocal.contact.id"
            data-cy="role-phone"
            density="comfortable"
          />
        </v-col>
      </v-row>
    </v-form>
  </v-container>
</template>