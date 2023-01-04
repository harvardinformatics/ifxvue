<script>
import IFXItemSelectableMixin from '@/components/item/IFXItemSelectableMixin'

export default {
  name: 'IFXSelectAffiliation',
  mixins: [IFXItemSelectableMixin],
  data() {
    return {
      contactType: null,
      search: '',
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
      return this.$api.user.userRoles.filter(
        (role) => this.$api.auth.can('edit-affiliations', this.$api.authUser) || role.value === 'member'
      )
    },
    onlyOrgNames() {
      return this.allItems.map((item) => this.$options.filters.orgNameFromSlug(item))
    }
  },
  methods: {},
  watch: {
    isValid(valid) {
      this.$emit('update:valid', valid)
    },
  },
}
</script>
<template>
  <v-container fluid v-if="!isLoading">
    <v-form ref="form" v-model="isValid">
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
          <v-autocomplete
            v-model="itemLocal.organization"
            label="Search for an organization"
            :items="onlyOrgNames"
            auto-select-first
            clearable
            clear-icon="mdi-close-circle"
            hide-selected
            :search-input.sync="search"
            @change="search = ''"
            data-cy="select-organization"
            required
            :rules="formRules.generic"
            :error-messages="errors['organization']"
          >
          </v-autocomplete>
        </v-col>
      </v-row>
    </v-form>
  </v-container>
</template>
