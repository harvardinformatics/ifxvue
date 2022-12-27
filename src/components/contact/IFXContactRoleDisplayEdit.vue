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
  },

  data() {
    return {
      roleEditingEnabled: false,
      allRoles: ['Additional Email', 'Work Phone', 'Additional Phone', 'Additional Contact'],
      rowKey: 0,
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
      return this.allRoles.filter((role) => role.includes(this.contact?.type) || role === 'Additional Contact')
    },
  },
  methods: {
    setContactActiveState(active) {
      this.itemLocal.active = active
      // This is a hack to get the row to update based on the active state
      this.rowKey++
      this.$emit('update', this.itemLocal)
    },
    toggleEditing() {
      this.roleEditingEnabled = !this.roleEditingEnabled
    },
    updateContact() {
      this.$emit('update', this.itemLocal)
      this.roleEditingEnabled = false
    },
    cancelContact() {
      this.roleEditingEnabled = false
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
        label="Role"
        :rules="formRules.generic"
        required
      ></v-select>
      <v-btn x-small outlined class="mr-2" color="secondary" @click.stop="cancelContact">Cancel</v-btn>
      <v-btn x-small class="mr-2" color="primary" @click.stop="updateContact(itemLocal)">Save</v-btn>
    </v-col>
    <v-col
      md="4"
      v-else
      :class="{ 'text-decoration-line-through': $api.auth.can('see-inactive-contacts') && !itemLocal.active }"
    >
      {{ itemLocal.role }}
    </v-col>
    <v-col :class="{ 'text-decoration-line-through': $api.auth.can('see-inactive-contacts') && !itemLocal.active }">
      <a :href="`${itemLocal.type === 'Phone' ? 'tel' : 'mailto'}:${itemLocal.detail}`">{{ itemLocal.detail }}</a>
    </v-col>
    <v-col>
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
          <v-icon v-on="on" v-bind="attrs" class="ml-2" small color="green" @click="setContactActiveState(true)">mdi-delete-restore</v-icon>
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
