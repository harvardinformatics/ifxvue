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
    appropriateRoles() {
      // We assume that the type and the role name both contain the same case-senstive value
      return this.$api.user.userRoles.filter(
        (role) => this.$api.auth.can('edit-affiliations', this.$api.authUser) || role.value === 'member'
      )
    },
  },
  methods: {
    clearSearch() {
      this.search = ''
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
  <v-container fluid v-if="!isLoading" class="pa-0">
    <v-form ref="form" v-model="isValid">
      <v-row density="compact">
        <v-col cols="12" sm="6" class="pr-sm-2">
          <v-autocomplete
            v-model="itemLocal.role"
            :items="appropriateRoles"
            :error-messages="errors['role']"
            :rules="formRules.generic"
            item-title="text"
            item-value="value"
            label="Role"
            required
            data-cy="select-role"
            density="comfortable"
          ></v-autocomplete>
        </v-col>
        <v-col cols="12" sm="6" class="pl-sm-2">
          <v-autocomplete
            v-model="itemLocal.organization"
            label="Search for an organization"
            :items="allItems"
            auto-select-first
            clearable
            clear-icon="mdi-close-circle"
            hide-selected
            v-model:search="search"
            @update:modelValue="clearSearch"
            data-cy="select-organization"
            required
            :rules="formRules.generic"
            :error-messages="errors['organization']"
            density="comfortable"
          >
            <template #item="{ props, item }">
              <v-list-item v-bind="props" :title="$orgNameFromSlug(item.value)"></v-list-item>
            </template>
            <template #selection="{ item }">
              {{ $orgNameFromSlug(item.value) }}
            </template>
          </v-autocomplete>
        </v-col>
      </v-row>
    </v-form>
  </v-container>
</template>