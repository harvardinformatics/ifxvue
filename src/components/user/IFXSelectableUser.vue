<script>
import IFXItemSelectableMixin from '@/components/item/IFXItemSelectableMixin'

export default {
  name: 'IFXSelectableUser',
  mixins: [IFXItemSelectableMixin]
}
</script>
<template>
<!-- TODO: error handling -->
  <v-container v-if="!isLoading">
    <!-- TODO: this should be the user detail form -->
    <v-row v-if='disabled'>
      <v-col>
        <h5>Full Name</h5>
        <p>{{itemLocal.user.fullName}}</p>
      </v-col>
      <v-col>
        <h5>Role</h5>
        <p>{{itemLocal.role}}</p>
      </v-col>
    </v-row>
    <v-row v-else>
      <v-col>
        <v-autocomplete
          v-model="itemLocal.user"
          label="User"
          :items="allItems"
          item-text="fullName"
          :error-messages="errors['users.user']"
          return-object
          :rules="formRules.contactable"
          required
        >
        </v-autocomplete>
      </v-col>
      <v-col>
        <v-select
          :items="$api.user.userRoles"
          v-model.trim="itemLocal.role"
          autocomplete="new-password"
          :error-messages="errors['users.role']"
          :rules='formRules.generic'
          label="Role"
          required
        ></v-select>
      </v-col>
    </v-row>
  </v-container>
</template>
