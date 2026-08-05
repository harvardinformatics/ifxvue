<script>
export default {
  name: 'IFXContactRoleDisplayEdit',
  mixins: [],
  components: {},
  props: {
    contact: {
      type: Object,
      required: true,
    },
    allRoles: {
      type: Array,
      required: false,
      default: () => [
        { name: 'Additional Email', editable: true },
        { name: 'Work Phone', editable: true },
        { name: 'Additional Phone', editable: true },
        { name: 'Additional Contact', editable: true },
      ],
    },
    filterRoles: {
      type: Boolean,
      required: false,
      default: true,
    },
  },

  data() {
    return {
      roleEditingEnabled: false,
      rowKey: 0,
      showExtraInfo: false,
    }
  },
  mounted() {},
  computed: {
    itemLocal: {
      get() {
        return this.contact
      },
      set(contact) {
        this.$emit('update:contact', contact)
      },
    },
    appropriateRoles() {
      return this.allRoles.filter(
        (role) => role.editable
          && (this.filterRoles ? role.name.includes(this.itemLocal.contact?.type) || role.name === 'Additional Contact' : true)
      )
    },
    isEditable() {
      const theRole = this.allRoles.find((role) => role.name === this.itemLocal.role)
      return theRole?.editable
    },
  },
  methods: {
    setContactActiveState(active) {
      this.itemLocal.active = active
      this.rowKey++
      this.$emit('change', this.itemLocal)
    },
    toggleEditing() {
      this.roleEditingEnabled = !this.roleEditingEnabled
    },
    updateContact() {
      this.$emit('change', this.itemLocal)
      this.roleEditingEnabled = false
    },
    cancelContact() {
      this.roleEditingEnabled = false
    },
    isFullContact(contact) {
      return contact.name && (contact.address || contact.phone)
    },
  },
}
</script>

<template>
  <v-row :key="rowKey" align="center">
    <v-col class="field-label" v-if="roleEditingEnabled">
      <div class="d-flex align-center flex-wrap ga-4">
        <v-select
          v-model.trim="itemLocal.role"
          :items="appropriateRoles"
          item-title="name"
          item-value="name"
          label="Role"
          :rules="formRules.generic"
          required
          density="compact"
          style="min-width: 180px; max-width: 200px;"
          hide-details
        />
        <div class="field-value">
          <span>for <strong>{{ itemLocal.detail }}</strong></span>
          <div class="d-flex ga-2">
            <v-btn
              variant="outlined"
              color="secondary"
              size="small"
              @click="cancelContact"
            >
              Cancel
            </v-btn>
            <v-btn
              variant="flat"
              color="primary"
              size="small"
              @click="updateContact(itemLocal)"
            >
              Accept
            </v-btn>
          </div>
        </div>
      </div>
    </v-col>
    <v-col
      v-else
      :class="{ 'field-label': true, 'text-decoration-line-through': $api.auth.can('see-inactive-contacts') && !itemLocal.active }"
    >
      {{ itemLocal.role }}
      <v-btn
        variant="text"
        size="x-small"
        color="primary"
        @click.stop="showExtraInfo = !showExtraInfo"
        v-if="isFullContact(itemLocal.contact)"
      >
        {{ `(Show ${showExtraInfo ? 'less' : 'more'})` }}
      </v-btn>

      <div v-if="showExtraInfo" class="ml-8">
        <div>
          <span class="font-weight-medium">Name:</span>
          {{ itemLocal.contact.name }}
        </div>
        <div v-if="itemLocal.contact.address">
          <span class="font-weight-medium">Address:</span>
          {{ itemLocal.contact.address }}
        </div>
      </div>
      <div class="mt-1">
        <a :href="`${itemLocal.type === 'Phone' ? 'tel' : 'mailto'}:${itemLocal.detail}`">{{ itemLocal.detail }}</a>
      </div>
    </v-col>
    <v-col v-if="isEditable" md="4">
      <v-tooltip v-if="itemLocal.active" location="top">
        <template v-slot:activator="{ props }">
          <v-icon
            v-bind="props"
            class="ml-2"
            size="small"
            color="red"
            @click="setContactActiveState(false)"
            :disabled="roleEditingEnabled"
          >
            mdi-delete
          </v-icon>
        </template>
        <span>Deactivate contact</span>
      </v-tooltip>
      <v-tooltip v-else location="top">
        <template v-slot:activator="{ props }">
          <v-icon v-bind="props" class="ml-2" size="small" color="green" @click="setContactActiveState(true)">
            mdi-delete-restore
          </v-icon>
        </template>
        <span>Reactivate Contact</span>
      </v-tooltip>
      <v-tooltip v-if="itemLocal.active" location="top">
        <template v-slot:activator="{ props }">
          <v-icon v-bind="props" class="ml-2" size="small" color="primary" @click="toggleEditing">mdi-pencil</v-icon>
        </template>
        <span>Edit contact</span>
      </v-tooltip>
    </v-col>
  </v-row>
</template>
<style scoped>
  .field-label {
    font-weight: bold;
    flex-basis: 20%; max-width: 20%;
  }
  .field-value {
    flex-basis: 75%; max-width: 80%;
  }
</style>