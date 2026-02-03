<script>
import { mapActions } from 'vuex'
import IFXEmailContactCreateEdit from '@/components/contact/IFXEmailContactCreateEdit'
import IFXPhoneContactCreateEdit from '@/components/contact/IFXPhoneContactCreateEdit'
import IFXFullContactCreateEdit from '@/components/contact/IFXFullContactCreateEdit'

export default {
  name: 'IFXContactCreateEdit',
  components: {
    IFXEmailContactCreateEdit,
    IFXPhoneContactCreateEdit,
    IFXFullContactCreateEdit,
  },
  props: {
    contactType: {
      required: false,
      default: null
    },
    id: {
      required: false,
      default: null
    }
  },
  data() {
    return {
      allUsers: [],
      localContactType: this.contactType,
      item: null,
      isLoading: false,
    }
  },
  methods: {
    ...mapActions(['showMessage']),
    async init() {
      this.item = await this.getItem()
      this.cachedItem = JSON.parse(JSON.stringify(this.item))
      this.allUsers = await this.$api.user.getList().catch((err) => this.showMessage(err))
    },
    updateContactUsers(users) {
      this.item.users = users
    },
    updateContactOrganizations(organizations) {
      this.item.organizations = organizations
    },
  },
  computed: {
    title() {
      const createOrEdit = this.id ? 'Edit' : 'Create'
      const type = this.localContactType ? `${this.localContactType} Contact` : 'Contact'
      const id = this.item && this.item.name ? `for ${this.item.name}` : this.id || ''
      return `${createOrEdit} ${type} ${id}`
    },
    description() {
      return ''
    },
    isEditing() {
      return this.id !== null && this.id !== ''
    },
  },
  mounted() {
    if (this.id) {
      this.isLoading = true
      this.$api.contact.getByID(this.id)
        .then((contact) => {
          this.item = contact
          if (contact.type === 'Phone') {
            this.localContactType = 'Phone'
          } else if (contact.type === 'Email') {
            if (contact.name || contact.address || contact.phone) {
              this.localContactType = 'Full'
            } else {
              this.localContactType = 'Email'
            }
          } else {
            this.showMessage('This contact has an unusual contact type')
          }
        })
        .catch((error) => {
          this.showMessage(error)
        })
        .finally(() => {
          this.isLoading = false
        })
    }
  },
}
</script>

<template>
  <v-container v-if="!isLoading">
    <IFXPageHeader>
      <template #title>{{ title }}</template>
      <template #content v-if="description">{{ description }}</template>
    </IFXPageHeader>
    <v-container>
      <v-row>
        <v-col class="d-flex justify-start align-center ga-4">
          <span>Contact type</span>
          <v-radio-group
            v-model="localContactType"
            inline
            hide-details
          >
            <v-radio label="Email" value="Email" />
            <v-radio label="Phone" value="Phone" />
            <v-radio label="Full" value="Full" />
          </v-radio-group>
        </v-col>
      </v-row>
      <v-row>
        <v-col v-if="localContactType === 'Email'">
          <IFXEmailContactCreateEdit :isEditing="isEditing" :id="id" />
        </v-col>
        <v-col v-else-if="localContactType === 'Phone'">
          <IFXPhoneContactCreateEdit :isEditing="isEditing" :id="id" />
        </v-col>
        <v-col v-else-if="localContactType === 'Full'">
          <IFXFullContactCreateEdit :isEditing="isEditing" :id="id" />
        </v-col>
        <v-col v-else />
      </v-row>
    </v-container>
  </v-container>
</template>