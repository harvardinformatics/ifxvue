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
    orgSlugs: {
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
      isLoading: false,
      formName: 'userInfoForm',
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
      if (Object.prototype.hasOwnProperty.call(this.errors, key)) {
        delete this.errors[key]
      }
      this.$refs.userInfoForm.resetValidation()
    },
    trimOrgName(slug) {
      // Add safety check for non-string values
      if (!slug || typeof slug !== 'string') {
        return slug
      }
      return this.$api.organization.parseSlug(slug).name
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
  mounted() {
    this.$nextTick(() => {
      this.$refs.userInfoForm.validate()
    })
  },
}
</script>
<template>
  <v-container fluid v-if="!isLoading && !!item">
    <v-row>
      <v-col>
        <v-alert type="info" outlined closable elevation="1">
          Use this form to view and edit user information. Changes to most fields (except for application Groups) will
          update
          <em><strong>all related accounts</strong></em>
          associated with this user.
        </v-alert>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-form @submit.prevent v-model="isValid" autocomplete="off" validate-on="eager" ref="userInfoForm">
          <v-row class="my-2">
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
                class="required"
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
                class="required"
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
                class="required"
              ></v-text-field>
              <v-autocomplete
                v-if="canEdit('User.groups')"
                v-model="itemLocal.groups"
                :items="allGroupNames"
                clearable
                multiple
                chips
                label="Groups"
                :error-messages="errors.groups"
                @focus="clearError('groups')"
              >
                <template #chip="{ item }">
                  <v-chip
                    :color="getChipColorForGroup(item.raw)"
                    variant="flat"
                    closable
                    @click:close="removeGroup(item.raw)"
                  >
                    <strong class="text-black">{{ item.raw }}</strong>
                  </v-chip>
                </template>
              </v-autocomplete>
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
                class="required"
              ></v-text-field>
            </v-col>
            <v-col sm="6">
              <v-autocomplete
                v-model.trim="itemLocal.primaryAffiliation"
                :items="orgSlugs"
                label="Primary Affiliation"
                :error-messages="errors.primary_affiliation"
                @focus="clearError('primary_affiliation')"
                :disabled="!canEdit('User.primaryAffiliation')"
                :rules="formRules.generic"
                required
                class="required"
              >
                <template #item="{ props, item }">
                  <v-list-item v-bind="props" :title="trimOrgName(item.raw)"></v-list-item>
                </template>
                <template #selection="{ item }">
                  {{ trimOrgName(item.raw) }}
                </template>
              </v-autocomplete>
            </v-col>
          </v-row>
          <v-row>
            <v-col sm="6" offset="6">
              <v-switch
                :label="`${this.$api.vars.appNameFormatted} Login`"
                :disabled="!canEdit('User.isActive')"
                v-model="itemLocal.isActive"
              ></v-switch>
            </v-col>
          </v-row>
        </v-form>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.items-warning {
  font-style: italic;
  color: grey;
}
</style>