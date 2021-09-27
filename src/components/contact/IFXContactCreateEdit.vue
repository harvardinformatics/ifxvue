<script>
export default {
  name: 'IFXContactCreateEdit',
  props: {
    contactType: {
      required: false,
      default: null
    },
    id: {
      required: false,
    }
  },
  data() {
    return {
      allUsers: [],
      localContactType: this.contactType
    }
  },
  methods: {
    updateContactUsers(users) {
      this.$set(this.item.users, ...users)
    },
    updateContactOrganizations(organizations) {
      this.$set(this.item.organizations, ...organizations)
    },
  }
}
</script>

<template>
  <v-container v-if='!isLoading'>
    <IFXPageHeader>
      <template #title>{{title}}</template>
      <template #content>{{description}}</template>
    </IFXPageHeader>
    <v-container>
      <v-row>
        <v-col>
          Select a Contact type
          <v-radio-group
            v-model="localContactType"
            row
          >
            <v-radio
              label="Email"
              value="Email"
            >
            </v-radio>
            <v-radio
              label="Phone"
              value="Phone"
            >
            </v-radio>
            <v-radio
              label="Full"
              value="Full"
            >
            </v-radio>
          </v-radio-group>
        </v-col>
      </v-row>
      <v-row>
        <v-col v-if="localContactType === 'Email'">
          <IFXEmailContact :id="id"/>
        </v-col>
        <v-col v-else-if="localContactType === 'Phone'">
          <IFXPhoneContact :id="id"/>
        </v-col>
        <v-col v-else>
          <IFXFullContact :id="id"/>
        </v-col>
      </v-row>
    </v-container>
  </v-container>
</template>
