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
  mounted() {
    // this.contactType = this.getContactType()
    // console.log(this.search)
  },
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
    // getContactType() {
    //   if (!this.itemLocal.contact.type) {
    //     return null
    //   }
    //   if (this.itemLocal.contact.type === 'Email' && (this.itemLocal.contact.phone || this.itemLocal.contact.address || this.itemLocal.contact.name)) {
    //     return 'Full'
    //   }
    //   return this.itemLocal.contact.type
    // },
    // checkForNew(val) {
    //   if (val) {
    //     if (typeof val === 'string') {
    //       // This is a new contact. Create the object.
    //       this.itemLocal.contact = this.$api.contact.create({ detail: val })
    //     } else {
    //       // This is an existing contact.
    //       this.itemLocal.contact = val
    //     }
    //   }
    //   this.search = ''
    // },
    createNew(val) {
      // This is a new contact. Create the object.
      // this.itemLocal.contact = this.$api.contact.create({ detail: val })
      const contact = this.$api.contact.create({ detail: val })
      // if (val.includes('@')) {
      //   this.$set(this.itemLocal.contact, 'type', 'Email')
      // }
      if (/^[\\d+-]+$/.test(val)) {
        this.$set(contact, 'type', 'Phone')
      }
      // if (val.includes('@')) {
      this.$set(contact, 'type', 'Email')
      // }
      this.$set(this.itemLocal, 'contact', contact)
      this.$refs.autocomplete.isMenuActive = false
      this.newContacts.push(contact)
      this.$nextTick(() => {
        this.$refs.form.validate()
      })
    },
    contactTypeChange() {
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
    // itemLocal: {
    //   deep: true,
    //   handler(val) {
    //     // if (val?.contact && typeof val.contact === 'string') {
    //     //   // This is a new contact. Create the object.
    //     //   this.itemLocal.contact = this.$api.contact.create({ detail: val.contact })
    //     // }
    //     // this.contactType = this.getContactType()
    //   },
    // },
    // contactType: function (val) {
    //   if (val === 'Full') {
    //     this.itemLocal.contact.type = 'Email'
    //   } else {
    //     this.itemLocal.contact.type = val
    //   }
    // },
  },
}
</script>
<template>
  <v-container fluid v-if="!isLoading">
    <!-- TODO: this disabled section is basically the contact detail page - probably use that -->
    <span v-if="disabled">
      <v-row>
        <v-col>
          <h5>Name</h5>
          <p>{{ itemLocal.contact.name }}</p>
        </v-col>
        <v-col>
          <h5>Type</h5>
          <p>{{ itemLocal.contact.type }}</p>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <h5>Detail</h5>
          <p>{{ itemLocal.contact.detail }}</p>
        </v-col>
        <v-col>
          <h5>Phone</h5>
          <p>{{ itemLocal.contact.phone }}</p>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <h5>Address</h5>
          <p>{{ itemLocal.contact.address }}</p>
        </v-col>
      </v-row>
    </span>
    <span v-else>
      <!-- TODO: give user the option to select this, rather than checking it only -->
      <v-row no-gutters>
        <v-col>
          <v-autocomplete
            v-model="itemLocal.contact"
            ref="autocomplete"
            label="Search or create a contact"
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
            <v-radio label="Email" value="Email"></v-radio>
            <v-radio label="Phone" value="Phone"></v-radio>
            <!-- <v-radio label="Full" value="Full"></v-radio> -->
          </v-radio-group>
        </v-col>
      </v-row>
      <!-- <v-row v-if="contactType === 'Full'" no-gutters>
        <v-col>
          <v-row>
            <v-col>
              <v-autocomplete
                v-model="itemLocal.role"
                :items="allRoles"
                :error-messages="errors['contact.role']"
                :rules="formRules.generic"
                label="Role"
                required
                @input="checkValidForm()"
              ></v-autocomplete>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-text-field
                v-model.trim="itemLocal.contact.detail"
                autocomplete="new-password"
                :error-messages="errors['contacts.detail']"
                :rules="formRules.email"
                label="Email"
                required
                @input="checkValidForm()"
              ></v-text-field>
            </v-col>
            <v-col>
              <v-text-field
                v-model.trim="itemLocal.contact.phone"
                autocomplete="new-password"
                :error-messages="errors['contacts.phone']"
                label="Phone"
                @input="checkValidForm()"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-textarea
                v-model="itemLocal.contact.address"
                :rules="formRules.address"
                clearable
                label="Address"
                :rows="3"
                auto-grow
                @input="checkValidForm()"
              ></v-textarea>
            </v-col>
          </v-row>
        </v-col>
      </v-row> -->
      <v-form ref="form" v-model="isValid">
        <v-row v-if="isContactSelected">
          <!-- <v-col>
          <v-row> -->
          <v-col>
            <v-autocomplete
              v-model="itemLocal.role"
              :items="appropriateRoles"
              :error-messages="errors['role']"
              :rules="formRules.generic"
              label="Role"
              required
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
            ></v-text-field>
            <v-text-field
              v-if="itemLocal.contact.type === 'Phone'"
              v-model.trim="itemLocal.contact.detail"
              autocomplete="new-password"
              :error-messages="errors['contacts.detail']"
              :rules="formRules.generic"
              label="Phone"
              required
            ></v-text-field>
          </v-col>
          <!-- </v-row>
        </v-col> -->
        </v-row>
      </v-form>
      <!-- <v-row v-if="itemLocal.contact.type === 'Phone'" no-gutters>
        <v-col>
          <v-row>
            <v-col>
              <v-autocomplete
                v-model="itemLocal.role"
                :items="appropriateRoles"
                :error-messages="errors['role']"
                :rules="formRules.generic"
                label="Role"
                required
                @input="checkValidForm()"
              ></v-autocomplete>
            </v-col>
            <v-col>
              <v-text-field
                v-model.trim="itemLocal.detail"
                autocomplete="new-password"
                :error-messages="errors['contacts.detail']"
                :rules="formRules.phone"
                label="Phone"
                required
                @input="checkValidForm()"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
      <v-row v-else></v-row> -->
    </span>
  </v-container>
</template>
