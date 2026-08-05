<script>
export default {
  name: 'IFXAffiliationRoleDisplayEdit',
  mixins: [],
  components: {},
  props: {
    affiliation: {
      type: Object,
      required: true,
    },
    showInactive: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      roleEditingEnabled: false,
      rowKey: 0,
    }
  },
  mounted() {},
  computed: {
    itemLocal: {
      get() {
        return this.affiliation
      },
      set(affiliation) {
        this.$emit('update:affiliation', affiliation)
      },
    },
    appropriateRoles() {
      // If you're not an admin, you can only set yourself to member
      return this.$api.user.userRoles.filter(
        (role) => this.$api.auth.can('edit-affiliations', this.$api.authUser) || role.value === 'member'
      )
    },
  },
  methods: {
    setAffiliationActiveState(active) {
      this.itemLocal.active = active
      // This is a hack to get the row to update based on the active state
      this.rowKey++
      this.$emit('update', this.itemLocal)
    },
    toggleEditing() {
      this.roleEditingEnabled = !this.roleEditingEnabled
    },
    updateAffiliation() {
      this.$emit('update', this.itemLocal)
      this.roleEditingEnabled = false
    },
    cancelAffiliation() {
      this.roleEditingEnabled = false
    },
  },
}
</script>

<template>
  <v-row :key="rowKey" align="center">
    <v-col cols="8" v-if="roleEditingEnabled">
      <div class="d-flex align-center flex-wrap ga-4">
        <v-select
          v-model.trim="itemLocal.role"
          :items="appropriateRoles"
          item-title="text"
          item-value="value"
          label="Role"
          :rules="formRules.generic"
          required
          density="compact"
          style="min-width: 180px; max-width: 200px;"
          hide-details
        />
        <span>of <strong>{{ $orgNameFromSlug(affiliation.organization) }}</strong></span>
        <div class="d-flex ga-2">
          <v-btn
            variant="outlined"
            color="secondary"
            size="small"
            @click="cancelAffiliation"
          >
            Cancel
          </v-btn>
          <v-btn
            variant="flat"
            color="primary"
            size="small"
            @click="updateAffiliation(itemLocal)"
          >
            Accept
          </v-btn>
        </div>
      </div>
    </v-col>
    <v-col cols="8" v-else :class="{ 'text-decoration-line-through': !itemLocal.active }">
      <span>{{ $affiliationRoleDisplay(affiliation.role) }} of {{ $orgNameFromSlug(affiliation.organization) }}</span>
    </v-col>
    <v-col v-if="$api.auth.can('edit-affiliations')" cols="4">
      <v-tooltip v-if="itemLocal.active" location="top">
        <template v-slot:activator="{ props }">
          <v-icon
            v-bind="props"
            class="ml-2"
            size="small"
            color="red"
            @click.stop.prevent="setAffiliationActiveState(false)"
            :disabled="roleEditingEnabled"
          >
            mdi-delete
          </v-icon>
        </template>
        <span>Deactivate affiliation</span>
      </v-tooltip>
      <v-tooltip v-else location="top">
        <template v-slot:activator="{ props }">
          <v-icon
            v-bind="props"
            class="ml-2"
            size="small"
            color="green"
            @click.stop.prevent="setAffiliationActiveState(true)"
            :disabled="roleEditingEnabled"
          >
            mdi-delete-restore
          </v-icon>
        </template>
        <span>Reactivate affiliation</span>
      </v-tooltip>
      <v-tooltip v-if="itemLocal.active" location="top">
        <template v-slot:activator="{ props }">
          <v-icon v-bind="props" class="ml-2" size="small" color="primary" @click="toggleEditing">mdi-pencil</v-icon>
        </template>
        <span>Edit affiliation</span>
      </v-tooltip>
    </v-col>
  </v-row>
</template>