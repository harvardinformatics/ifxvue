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
    createNew(val) {
      // This is a new contact. Create the object.
      const contact = this.$api.contact.create({ detail: val })
      if (/^\(?\+?(\d)+[\d )-]*$/g.test(val)) {
        contact.type = 'Phone'
      } else {
        contact.type = 'Email'
      }
      this.itemLocal.contact = contact
      this.$refs.autocomplete.isMenuActive = false
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
      <v-row no-gutters>
        <v-col>
          <v-autocomplete
            v-model="itemLocal.contact"
            ref="autocomplete"
            label="Search to use an existing contect or enter text to create a new one"
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
            <template #no-data>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>
                    <p>
                      No Contact matching "
                      <strong>{{ search }}</strong>
                      ".
                      <v-btn
                        class="ml-2"
                        x-small
                        @click.stop="createNew(search)"
                        color="primary"
                        data-cy="create-new-contact"
                      >
                        Create
                      </v-btn>
                    </p>
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </template>
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
