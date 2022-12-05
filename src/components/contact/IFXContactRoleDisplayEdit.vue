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
    }
  },
  mounted() {
  },
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
        (role) => role.includes(this.contact?.type) || role === 'Additional Contact'
      )
    },
  },
  methods: {
    setContactActiveState(active) {
      this.itemLocal.active = active
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
  <v-row dense>
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
      <a :href="`mailto:${itemLocal.detail}`">{{ itemLocal.detail }}</a>
    </v-col>
    <v-col>
      <v-icon
        class="ml-2"
        small
        color="red"
        @click.stop.prevent="setContactActiveState(false)"
        v-if="itemLocal.active"
        :disabled="roleEditingEnabled"
      >
        mdi-delete
      </v-icon>
      <v-icon class="ml-2" small color="green" @click.stop="setContactActiveState(true)" v-else>
        mdi-delete-restore
      </v-icon>
      <v-icon v-if="itemLocal.active" class="ml-2" small color="primary" @click.stop="toggleEditing">
        mdi-pencil
      </v-icon>
    </v-col>
  </v-row>
</template>
