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
      // We assume that the type and the role name both contain the same case-senstive value
      return this.allRoles.filter(
        (role) => role.editable
          && (this.filterRoles ? role.name.includes(this.itemLocal.contact?.type) || role === 'Additional Contact' : true)
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
      // This is a hack to get the row to update based on the active state
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
  <v-row dense :key="rowKey">
    <v-col md="4" v-if="roleEditingEnabled">
      <v-select
        v-model.trim="itemLocal.role"
        :items="appropriateRoles"
        item-text="name"
        item-value="name"
        label="Role"
        :rules="formRules.generic"
        required
      ></v-select>
      <v-btn x-small outlined class="mr-2" color="secondary" @click.stop="cancelContact">Cancel</v-btn>
      <v-btn x-small class="mr-2" color="secondary" @click.stop="updateContact(itemLocal)">Accept</v-btn>
    </v-col>
    <v-col
      md="4"
      v-else
      :class="{ 'text-decoration-line-through': $api.auth.can('see-inactive-contacts') && !itemLocal.active }"
    >
      <v-btn
        icon
        small
        @click="showExtraInfo = !showExtraInfo"
        class="expand-icon"
        :class="{ invisible: !isFullContact(itemLocal.contact) }"
      >
        <v-icon :class="{ active: showExtraInfo }">mdi-menu-right</v-icon>
      </v-btn>
      {{ itemLocal.role }}
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
    </v-col>
    <v-col :class="{ 'text-decoration-line-through': $api.auth.can('see-inactive-contacts') && !itemLocal.active }">
      <a :href="`${itemLocal.type === 'Phone' ? 'tel' : 'mailto'}:${itemLocal.detail}`">{{ itemLocal.detail }}</a>
    </v-col>
    <v-col v-if="isEditable">
      <v-tooltip v-if="itemLocal.active" top>
        <template v-slot:activator="{ on, attrs }">
          <v-icon
            v-bind="attrs"
            v-on="on"
            class="ml-2"
            small
            color="red"
            @click="setContactActiveState(false)"
            :disabled="roleEditingEnabled"
          >
            mdi-delete
          </v-icon>
        </template>
        <span>Deactivate contact</span>
      </v-tooltip>
      <v-tooltip v-else top>
        <template v-slot:activator="{ on, attrs }">
          <v-icon v-on="on" v-bind="attrs" class="ml-2" small color="green" @click="setContactActiveState(true)">
            mdi-delete-restore
          </v-icon>
        </template>
        <span>Reactivate Contact</span>
      </v-tooltip>
      <v-tooltip v-if="itemLocal.active" top>
        <template v-slot:activator="{ on, attrs }">
          <v-icon v-on="on" v-bind="attrs" class="ml-2" small color="primary" @click="toggleEditing">mdi-pencil</v-icon>
        </template>
        <span>Edit contact</span>
      </v-tooltip>
    </v-col>
  </v-row>
</template>
<style lang="scss" scoped>
.expand-icon {
  transition: rotate 0.3s ease-in-out;

  .active {
    -webkit-transform: rotate(90deg);
    transform: rotate(90deg);
  }
}
.invisible {
  visibility: hidden;
}
</style>
