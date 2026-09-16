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
    allItems: {
      immediate: true,
      handler(val) {
        // Debug: remove after fixing
        console.log('allItems received:', val)
      }
    },
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
  <v-container fluid v-if="!isLoading">
    <!-- Disabled/read-only view -->
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

    <!-- Editable view -->
    <span v-else>
      <v-row v-if="isSearchVisible">
        <v-col>
          <v-autocomplete
            v-model="itemLocal.contact"
            autocomplete="new-password"
            label="Search existing contacts"
            :items="allItems"
            item-title="name"
            item-value="id"
            return-object
            clearable
            no-data-text="No contacts found"
          >
            <template v-slot:item="{ item, props }">
              <v-list-item
                v-bind="props"
                :title="item.raw.name"
                :subtitle="item.raw.detail || item.raw.type"
              />
            </template>
          </v-autocomplete>
        </v-col>
      </v-row>

      <v-row>
        <v-col>
          <span v-if="!itemLocal.contact">Select a </span>Contact type
          <v-radio-group
            v-model="contactType"
            inline
          >
            <v-radio label="Email" value="Email" />
            <v-radio label="Phone" value="Phone" />
            <v-radio label="Full" value="Full" />
          </v-radio-group>
        </v-col>
      </v-row>

      <!-- Full contact type -->
      <v-row v-if="contactType === 'Full'">
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
                @update:modelValue="checkValidForm()"
              />
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
                @update:modelValue="checkValidForm()"
              />
            </v-col>
            <v-col>
              <v-text-field
                v-model.trim="itemLocal.phone"
                autocomplete="new-password"
                :error-messages="errors['contacts.phone']"
                label="Phone"
                @update:modelValue="checkValidForm()"
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-textarea
                v-model="itemLocal.address"
                :rules="formRules.address"
                clearable
                label="Address"
                :rows="3"
                auto-grow
                @update:modelValue="checkValidForm()"
              />
            </v-col>
          </v-row>
        </v-col>
      </v-row>

      <!-- Email contact type -->
      <v-row v-if="contactType === 'Email'">
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
                @update:modelValue="checkValidForm()"
              />
            </v-col>
            <v-col>
              <v-text-field
                v-model.trim="itemLocal.detail"
                autocomplete="new-password"
                :error-messages="errors['contacts.detail']"
                :rules="formRules.email"
                label="Email"
                required
                @update:modelValue="checkValidForm()"
              />
            </v-col>
          </v-row>
        </v-col>
      </v-row>

      <!-- Phone contact type -->
      <v-row v-if="contactType === 'Phone'">
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
                @update:modelValue="checkValidForm()"
              />
            </v-col>
            <v-col>
              <v-text-field
                v-model.trim="itemLocal.detail"
                autocomplete="new-password"
                :error-messages="errors['contacts.detail']"
                :rules="formRules.phone"
                label="Phone"
                required
                @update:modelValue="checkValidForm()"
              />
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </span>
  </v-container>
</template>