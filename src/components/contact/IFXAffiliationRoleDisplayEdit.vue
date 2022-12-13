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
  <v-row dense :key="rowKey">
    <v-col md="8" v-if="roleEditingEnabled" class="d-flex flex-row">
      <span>
        <v-select
          v-model.trim="itemLocal.role"
          :items="appropriateRoles"
          label="Role"
          :rules="formRules.generic"
          required
        ></v-select>
        <v-btn x-small outlined class="mr-2" color="secondary" @click="cancelAffiliation">Cancel</v-btn>
        <v-btn x-small color="primary" @click="updateAffiliation(itemLocal)">Save</v-btn>
      </span>
      <span class="ml-2">of {{ affiliation.organization | orgNameFromSlug }}</span>
    </v-col>
    <v-col
      md="8"
      v-else
      :class="{ 'text-decoration-line-through': $api.auth.can('see-inactive-affiliations') && !itemLocal.active }"
    >
      <span>{{ affiliation.role | affiliationRoleDisplay }} of {{ affiliation.organization | orgNameFromSlug }}</span>
    </v-col>
    <v-col v-if="$api.auth.can('edit-affiliations')" md="4">
      <v-icon
        class="ml-2"
        small
        color="red"
        @click.stop.prevent="setAffiliationActiveState(false)"
        v-if="itemLocal.active"
        :disabled="roleEditingEnabled"
      >
        mdi-delete
      </v-icon>
      <v-icon
        class="ml-2"
        small
        color="green"
        @click.stop.prevent="setAffiliationActiveState(true)"
        v-else
        :disabled="roleEditingEnabled"
      >
        mdi-delete-restore
      </v-icon>
      <v-icon v-if="itemLocal.active" class="ml-2" small color="primary" @click="toggleEditing">mdi-pencil</v-icon>
    </v-col>
  </v-row>
</template>
