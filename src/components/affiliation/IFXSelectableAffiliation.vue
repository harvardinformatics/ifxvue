<script>
import IFXItemSelectableMixin from '@/components/item/IFXItemSelectableMixin'

export default {
  name: 'IFXSelectableAffiliation',
  mixins: [IFXItemSelectableMixin],
  computed: {
    isSearchVisible() {
      return !this.itemLocal.affiliation || !this.itemLocal.affiliation.id
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
          <h5>Organization</h5>
          <p>{{itemLocal.organization}}</p>
        </v-col>
        <v-col>
          <h5>Role</h5>
          <p>{{itemLocal.role}}</p>
        </v-col>
      </v-row>
    </span>
    <span v-else>
      <v-row>
        <v-col>
          <v-autocomplete
            v-model="itemLocal.organization"
            label="Organization"
            :items="allItems"
            :error-messages="errors['affiliations.organization']"
            return-object
            :rules="formRules.generic"
            required
          >
          </v-autocomplete>
        </v-col>
        <v-col>
          <v-text-field
            v-model.trim="itemLocal.role"
            autocomplete="new-password"
            :error-messages="errors['affiliations.role']"
            :rules='formRules.generic'
            label="Role"
            required
          ></v-text-field>
        </v-col>
      </v-row>
    </span>
  </v-container>
</template>
