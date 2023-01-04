<script>
import IFXItemSelectableMixin from '@/components/item/IFXItemSelectableMixin'

export default {
  name: 'IFXSelectableContact',
  mixins: [IFXItemSelectableMixin],
  computed: {
    isSearchVisible() {
      return !this.itemLocal.contact || !this.itemLocal.contact.id
    },
  },
  data() {
    return {
      contactType: null
    }
  },
  watch: {
    itemLocal: {
      deep: true,
      handler() {
        if (!this.contactType) {
          this.contactType = this.getContactType()
        }
      }
    },
    contactType: function (val) {
      if (val === 'Full') {
        this.itemLocal.type = 'Email'
      } else {
        this.itemLocal.type = val
      }
    }
  },
  methods: {
    checkValidForm() {
      this.$emit('check-valid-form')
    },
    getContactType() {
      if (!this.itemLocal.type) {
        return null
      }
      if (this.itemLocal.type === 'Email' && (this.itemLocal.phone || this.itemLocal.address || this.itemLocal.name)) {
        return 'Full'
      }
      return this.itemLocal.type
    }
  },
  mounted() {
    this.contactType = this.getContactType()
  }
}
</script>
<template>
  <v-container fluid v-if='!isLoading'>
    <!-- TODO: this disabled section is basically the contact detail page - probably use that -->
    <span v-if='disabled'>
      <v-row>
        <v-col>
          <h5>Name</h5>
          <p>{{itemLocal.contact.name}}</p>
        </v-col>
        <v-col>
          <h5>Type</h5>
          <p>{{itemLocal.contact.type}}</p>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <h5>Detail</h5>
          <p>{{itemLocal.contact.detail}}</p>
        </v-col>
        <v-col>
          <h5>Phone</h5>
          <p>{{itemLocal.contact.phone}}</p>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <h5>Address</h5>
          <p>{{itemLocal.contact.address}}</p>
        </v-col>
      </v-row>
    </span>
    <span v-else>
    <!-- TODO: give user the option to select this, rather than checking it only -->
      <v-row v-if="isSearchVisible" no-gutters>
        <v-col>
          <v-autocomplete
            v-model="itemLocal.contact"
            autocomplete="new-password"
            label="Search existing contacts"
            :items="allItems"
            item-text="name"
            return-object
          >
          </v-autocomplete>
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-col>
          <span v-if="!itemLocal.contact">Select a </span>Contact type
          <v-radio-group
            v-model="contactType"
            row
          >
            <v-radio
              label="Email"
              value="Email"
            >
            </v-radio>
            <v-radio
              label="Phone"
              value="Phone"
            >
            </v-radio>
            <v-radio
              label="Full"
              value="Full"
            >
            </v-radio>
          </v-radio-group>
        </v-col>
      </v-row>
      <v-row v-if="contactType === 'Full'" no-gutters>
        <v-col>
          <v-row>
            <v-col>
              <v-text-field
                v-model.trim="itemLocal.role"
                autocomplete="new-password"
                :error-messages="errors['contacts.role']"
                :rules="formRules.generic"
                label="Role"
                required
                @input="checkValidForm()"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-text-field
                v-model.trim="itemLocal.detail"
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
                v-model.trim="itemLocal.phone"
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
                v-model="itemLocal.address"
                :rules='formRules.address'
                clearable
                label="Address"
                :rows="3"
                auto-grow
                @input="checkValidForm()"
              >
              </v-textarea>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
      <v-row v-if="contactType === 'Email'" no-gutters>
        <v-col>
          <v-row>
            <v-col>
              <v-text-field
                v-model.trim="itemLocal.role"
                autocomplete="new-password"
                :error-messages="errors['contacts.role']"
                :rules="formRules.generic"
                label="Role"
                required
                @input="checkValidForm()"
              ></v-text-field>
            </v-col>
            <v-col>
              <v-text-field
                v-model.trim="itemLocal.detail"
                autocomplete="new-password"
                :error-messages="errors['contacts.detail']"
                :rules="formRules.email"
                label="Email"
                required
                @input="checkValidForm()"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
      <v-row v-if="contactType === 'Phone'" no-gutters>
        <v-col>
          <v-row>
            <v-col>
              <v-text-field
                v-model.trim="itemLocal.role"
                autocomplete="new-password"
                :error-messages="errors['contacts.role']"
                :rules="formRules.generic"
                label="Role"
                required
                @input="checkValidForm()"
              ></v-text-field>
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
      <v-row v-else>
      </v-row>
    </span>
  </v-container>
</template>
