<script>
import IFXUserMixin from '@/components/user/IFXUserMixin'

export default {
  name: 'IFXUserInfoEdit',
  mixins: [IFXUserMixin],
  components: {},
  props: {
    allGroupNames: {
      type: Array,
      required: true,
    },
    item: {
      type: Object,
      required: true,
    },
    errors: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      isValid: false,
    }
  },
  methods: {
    canEdit(field) {
      return this.apiRef.canEditField(field)
    },
    removeGroup(group) {
      const index = this.itemLocal.groups.indexOf(group)
      if (index !== -1) this.itemLocal.groups.splice(index, 1)
    },
    getChipColorForGroup(group) {
      return this.$api.group.colorForGroup(group)
    },
    clearError(key) {
      if (this.errors.hasOwnProperty(key)) {
        this.$delete(this.errors, key)
      }
    },
  },
  watch: {
    isValid(valid) {
      this.$emit('update:valid', valid)
    },
  },

  computed: {
    itemLocal: {
      get() {
        return this.item
      },
      set(item) {
        this.$emit('update:item', item)
      },
    },
    hasIFXID() {
      if (!this.item) {
        return false
      }
      return !!this.itemLocal.ifxid
    },
  },
}
</script>
<template>
  <v-container fluid v-if="!isLoading && !!item">
    <v-container fluid v-if="hasIFXID">
      <v-row no-gutters>
        <v-col>
          <p>
            Use this form to view and edit user information. Changes to most fields (except for application Groups) will
            update
            <em><strong>all related accounts</strong></em>
            associated with this user.
          </p>
        </v-col>
      </v-row>
      <v-form @submit.prevent v-model="isValid" autocomplete="off" :ref="formName">
        <v-row>
          <v-col sm="6">
            <v-text-field
              v-model.trim="itemLocal.firstName"
              label="First name"
              autocomplete="new-password"
              :error-messages="errors.firstName"
              @focus="clearError('first_name')"
              :disabled="!canEdit('User.firstName')"
              :rules="formRules.generic"
              required
            ></v-text-field>
            <v-text-field
              v-model.trim="itemLocal.fullName"
              label="Full name"
              autocomplete="new-password"
              :error-messages="errors.fullName"
              @focus="clearError('full_name')"
              :disabled="!canEdit('User.fullName')"
              :rules="formRules.generic"
              required
            ></v-text-field>
          </v-col>
          <v-col sm="6">
            <v-text-field
              v-model.trim="itemLocal.lastName"
              label="Last name"
              autocomplete="new-password"
              :error-messages="errors.lastName"
              @focus="clearError('last_name')"
              :disabled="!canEdit('User.lastName')"
              :rules="formRules.generic"
              required
            ></v-text-field>
            <v-combobox
              v-if="canEdit('User.groups')"
              v-model="itemLocal.groups"
              :items="allGroupNames"
              clearable
              multiple
              label="Groups"
              hint="Groups to which this user belongs."
              persistent-hint
              :error-messages="errors.groups"
            >
              <template #selection="{ item }">
                <v-chip :color="getChipColorForGroup(item)" close @click:close="removeGroup(item)">
                  <strong>{{ item }}</strong>
                </v-chip>
              </template>
            </v-combobox>
            <div class="items-warning" v-else>{{ itemLocal.groups.join(', ') || 'No groups' }}</div>
          </v-col>
        </v-row>
        <v-row>
          <v-col sm="6">
            <v-text-field
              v-model.trim="itemLocal.primaryEmail"
              label="Primary Email"
              autocomplete="new-password"
              :error-messages="errors.primary_email"
              @focus="clearError('primary_email')"
              :disabled="!canEdit('User.primaryEmail')"
              :rules="formRules.email"
              required
            ></v-text-field>
          </v-col>
          <v-col sm="6">
            <v-switch
              :label="`${this.$api.vars.appNameFormatted} Login`"
              :disabled="!canEdit('User.isActive')"
              v-model="itemLocal.isActive"
            ></v-switch>
          </v-col>
        </v-row>
      </v-form>
    </v-container>
    <v-container v-else>
      <v-alert :value="true" type="error" outlined>
        Application users that are not associated with a Person cannot be edited with this form. Use Django admin forms
        for these edits.
      </v-alert>
    </v-container>
  </v-container>
</template>

<style scoped>
.items-warning {
  font-style: italic;
  color: grey;
}
</style>
