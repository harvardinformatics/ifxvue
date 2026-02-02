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
  <v-container v-if='!isLoading' fluid class="pa-0">
    <span v-if='disabled'>
      <v-row no-gutters>
        <v-col cols="12" sm="6" class="pr-sm-2">
          <h5 class="mb-2">Organization</h5>
          <p>{{ itemLocal.organization }}</p>
        </v-col>
        <v-col cols="12" sm="6" class="pl-sm-2">
          <h5 class="mb-2">Role</h5>
          <p>{{ itemLocal.role }}</p>
        </v-col>
      </v-row>
    </span>
    <span v-else>
      <v-row no-gutters>
        <v-col cols="12" sm="6" class="pr-sm-2">
          <v-autocomplete
            v-model="itemLocal.organization"
            label="Organization"
            :items="allItems"
            :error-messages="errors['affiliations.organization']"
            return-object
            :rules="formRules.generic"
            required
            density="comfortable"
          >
          </v-autocomplete>
        </v-col>
        <v-col cols="12" sm="6" class="pl-sm-2">
          <v-text-field
            v-model.trim="itemLocal.role"
            autocomplete="new-password"
            :error-messages="errors['affiliations.role']"
            :rules='formRules.generic'
            label="Role"
            required
            density="comfortable"
          ></v-text-field>
        </v-col>
      </v-row>
    </span>
  </v-container>
</template>