<script>
import { mapActions } from 'vuex'
import IFXItemCreateEditMixin from '@/components/item/IFXItemCreateEditMixin'
import IFXContactMixin from '@/components/contact/IFXContactMixin'

export default {
  name: 'IFXContactCreateEdit',
  mixins: [IFXContactMixin, IFXItemCreateEditMixin],
  data() {
    return {
      allUsers: [],
    }
  },
  methods: {
    ...mapActions(['showMessage']),
    async init() {
      this.item = await this.getItem()
      this.cachedItem = JSON.parse(JSON.stringify(this.item))
      // TODO: only get chunks
      this.allUsers = await this.$api.user.getList()
        .catch(err => this.showMessage(err))
    },
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
      <v-form v-if='!isLoading' v-model='isValid'>
        <v-row>
          <v-col>
            <v-text-field
              v-model='item.name'
              label='Name'
              :rules='formRules.generic'
              :error-messages='errors.name'
              required
            ></v-text-field>
          </v-col>
          <v-col>
            <v-text-field
              v-model='item.detail'
              label='Email'
              :rules='formRules.email'
              :error-messages='errors.detail'
              required
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-select
              v-model='item.type'
              label='Type'
              :items='apiRef.types'
              :rules='formRules.generic'
              :error-messages='errors.type'
              required
            ></v-select>
          </v-col>
          <v-col>
            <v-text-field
              v-model='item.phone'
              label='Phone'
              type='number'
              :rules='formRules.phone'
            >
            </v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-text-field
              v-model='item.address'
              label='Address'
            ></v-text-field>
          </v-col>
        </v-row>
        <!-- TODO: Add reverse search for users and org contacts associated with this contact -->
        <!-- <span v-if='isEditing'>
          <v-row>
            <v-col>
              <IFXItemSelectList title='Users' :items='contact.users' disabled v-slot="{ item }">
                <IFXUserEdit :item='item'/>
              </IFXItemSelectList>
            </v-col>
            <v-col>
              <IFXItemSelectList title='Organization Contacts' :items='contact.contacts' disabled v-slot="{ item }">
                <IFXOrganizationContactEdit :item='item'/>
              </IFXItemSelectList>
            </v-col>
          </v-row>
        </span> -->
        <v-row>
          <v-col>
            <IFXButton :disabled='!isSubmittable' btnType='submit' @action='submit' />
          </v-col>
        </v-row>
      </v-form>
    </v-container>
  </v-container>
</template>
