<script>
import IFXItemSelectableMixin from '@/components/item/IFXItemSelectableMixin'

export default {
  name: 'IFXSelectableContact',
  mixins: [IFXItemSelectableMixin],
  computed: {
    isSearchVisible() {
      return !this.itemLocal.contact || !this.itemLocal.contact.id
    },
  }
}
</script>
<template>
  <v-container v-if='!isLoading'>
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
      <v-row v-if="isSearchVisible">
        <v-col>
          <v-autocomplete
            v-model="itemLocal.contact"
            autocomplete="new-password"
            label="Search existing contacts"
            :items="allItems"
            :error-messages="errors['contacts.contact']"
            item-text="name"
            return-object
            :rules='formRules.contactable'
          >
          </v-autocomplete>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-text-field
            v-model.trim="itemLocal.contact.name"
            autocomplete="new-password"
            :error-messages="errors['contacts.name']"
            :rules="formRules.generic"
            label="Name"
            required
          ></v-text-field>
        </v-col>
        <v-col>
          <v-select
            :items='$api.contact.types'
            v-model.trim='itemLocal.type'
            autocomplete="new-password"
            :error-messages="errors['contacts.type']"
            :rules='formRules.generic'
            label="Type"
            required
          ></v-select>
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
          ></v-text-field>
        </v-col>
        <v-col>
          <v-text-field
            v-model.trim="itemLocal.contact.phone"
            autocomplete="new-password"
            :error-messages="errors['contacts.phone']"
            label="Phone"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-text-field
            v-model="itemLocal.contact.address"
            :rules='formRules.address'
            clearable
            label="Address"
          >
          </v-text-field>
        </v-col>
      </v-row>
    </span>
  </v-container>
</template>
