<script>
import IFXItemSelectableMixin from '@/components/item/IFXItemSelectableMixin'

export default {
  name: 'IFXSelectCreateContact',
  mixins: [IFXItemSelectableMixin],
  data() {
    return {
      contactType: null,
      allRoles: ['Additional Email', 'Work Phone', 'Additional Phone', 'Additional Contact'],
      search: '',
      newContacts: [],
      isValid: false,
      createNewSelected: false,
      newContactDetail: null,
    }
  },
  mounted() {},
  computed: {
    isContactSelected() {
      return this.itemLocal.contact?.detail || this.createNewSelected
    },
    appropriateRoles() {
      // We assume that the type and the role name both contain the same case-senstive value
      return this.allRoles.filter(
        (role) => role.includes(this.itemLocal.contact?.type) || role === 'Additional Contact'
      )
    },
    radioIsDisabled() {
      return !!this.itemLocal.contact?.id
    },
    allContacts() {
      return this.allItems.concat(this.newContacts)
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
    },
    contactTypeChange() {
      this.itemLocal.role = null
      this.$nextTick(() => {
        this.$refs.form.validate()
      })
    },
    getContactIcon(contact) {
      if (contact.type === 'Email') {
        return 'mdi-email-newsletter'
      }
      if (contact.type === 'Phone') {
        return 'mdi-phone-classic'
      }
      return 'mdi-help-circle'
    },
    openCreateUI() {
      this.newContactDetail = this.search
      this.createNewSelected = true
    },
    detailIsUnique(v) {
      return (
        (v && v.length && this.allItems.every((contact) => contact.detail !== v))
        || 'Contact information cannot be empty and must be unique'
      )
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
  <v-container fluid v-if="!isLoading">
    <span>
      <v-row align="center">
        <v-col>
          <v-autocomplete
            v-show="!createNewSelected"
            v-model="itemLocal.contact"
            label="Search for an existing contect"
            :items="allContacts"
            item-text="detail"
            return-object
            auto-select-first
            clearable
            clear-icon="mdi-close-circle"
            hide-selected
            :search-input.sync="search"
            @change="search = ''"
            data-cy="select-contact"
            :menu-props="{ closeOnContentClick: true, closeOnClick: true }"
            :disabled="createNewSelected"
          >
            <template v-slot:selection="{ attrs, item }">
              {{ selected }}
              <v-chip v-bind="attrs" label small color="primary">
                <v-icon small>{{ getContactIcon(item) }}</v-icon>
                <span class="ml-2">
                  {{ item.detail }}
                </span>
              </v-chip>
            </template>
          </v-autocomplete>
        </v-col>
        <v-col cols="2">
          <v-btn x-small class="ml-2" color="primary" @click="createNew" v-if="!createNewSelected">Create new</v-btn>
          <v-btn x-small outlined class="ml-2" color="secondary" @click="createNewSelected = false" v-else>
            Search
          </v-btn>
        </v-col>
      </v-row>
      <v-row no-gutters v-if="isContactSelected">
        <v-col>
          <v-radio-group v-model="itemLocal.contact.type" row :disabled="radioIsDisabled" @change="contactTypeChange">
            <template v-slot:label>
              <span v-if="!itemLocal.contact.id">Select a</span>
              Contact type
            </template>
            <v-radio label="Email" value="Email" data-cy="select-contact-email"></v-radio>
            <v-radio label="Phone" value="Phone" data-cy="select-contact-phone"></v-radio>
          </v-radio-group>
        </v-col>
      </v-row>
      <v-form ref="form" v-model="isValid" v-if="isContactSelected">
        <v-row>
          <v-col>
            <v-autocomplete
              v-model="itemLocal.role"
              :items="appropriateRoles"
              :error-messages="errors['role']"
              :rules="formRules.generic"
              label="Role"
              required
              data-cy="select-role"
            ></v-autocomplete>
          </v-col>
          <v-col>
            <v-text-field
              v-if="itemLocal.contact.type === 'Email'"
              v-model.trim="itemLocal.contact.detail"
              autocomplete="new-password"
              :error-messages="errors['contacts.detail']"
              :rules="[detailIsUnique].concat(formRules.email)"
              label="Email"
              required
              :disabled="!!itemLocal.contact.id"
              data-cy="role-email"
            ></v-text-field>
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
            ></v-text-field>
          </v-col>
        </v-row>
      </v-form>
    </span>
  </v-container>
</template>
