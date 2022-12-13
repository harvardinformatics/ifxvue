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
      showCreateUI: false,
      newContactDetail: null,
    }
  },
  mounted() {},
  computed: {
    isContactSelected() {
      return this.itemLocal.contact?.detail
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
      // This is a new contact. Verify this detail doesn't already exist
      // const index = this.allContacts.findIndex((contact) => contact.detail === this.newContactDetail)
      // if (index !== -1) {
      // }
      // Create the object.
      const contact = this.$api.contact.create({ detail: this.newContactDetail })
      if (/^\(?\+?(\d)+[\d )-]*$/g.test(this.newContactDetail)) {
        contact.type = 'Phone'
      } else {
        contact.type = 'Email'
      }
      this.itemLocal.contact = contact
      this.newContacts.push(contact)
      this.$nextTick(() => {
        this.$refs.form.validate()
      })
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
      this.showCreateUI = true
    },
    detailIsUnique(v) {
      return (
        (v && v.length && this.allContacts.every((contact) => contact.detail !== v)) || 'Contact information cannot be empty and must be unique'
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
      <!-- TODO: give user the option to select this, rather than checking it only -->
      <v-row align="center">
        <v-col v-if="!showCreateUI">
          <v-autocomplete
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
        <v-col v-else>
          <span>
            <v-text-field
              v-model.trim="newContactDetail"
              label="New contact information"
              :rules="[detailIsUnique]"
              required
              :disabled="itemLocal.contact.detail"
            ></v-text-field>
          </span>
        </v-col>
        <v-col cols="2" v-if="!showCreateUI">
          <v-btn x-small class="ml-2" color="primary" @click="openCreateUI">Create new</v-btn>
        </v-col>
        <v-col cols="3" v-else>
          <v-btn x-small outlined class="ml-2" color="secondary" @click="showCreateUI = false">Cancel</v-btn>
          <v-btn x-small class="ml-2" color="primary" :disabled="!newContactDetail || itemLocal.contact.detail" @click="createNew">Save</v-btn>
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
              :rules="formRules.email"
              label="Email"
              required
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
              data-cy="role-phone"
            ></v-text-field>
          </v-col>
        </v-row>
      </v-form>
    </span>
  </v-container>
</template>
