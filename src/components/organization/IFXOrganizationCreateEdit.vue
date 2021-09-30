<script>
import { mapActions } from 'vuex'
import IFXItemCreateEditMixin from '@/components/item/IFXItemCreateEditMixin'
import IFXItemSelectList from '@/components/item/IFXItemSelectList'
import IFXOrganizationMixin from '@/components/organization/IFXOrganizationMixin'
import IFXSelectableContact from '@/components/contact/IFXSelectableContact'
import IFXSelectableUser from '@/components/user/IFXSelectableUser'

export default {
  name: 'IFXOrganizationCreateEdit',
  mixins: [IFXOrganizationMixin, IFXItemCreateEditMixin],
  components: {
    IFXItemSelectList,
    IFXSelectableContact,
    IFXSelectableUser
  },
  data() {
    return {
      allUsers: [],
      allContacts: [],
      formName: 'organizationForm'
    }
  },
  methods: {
    ...mapActions(['showMessage']),
    async init() {
      this.item = await this.getItem()
      if (!this.item.id) {
        this.item.orgTree = 'Local'
      }
      this.cachedItem = JSON.stringify(this.apiRef.decompose(this.item))
      this.allUsers = await this.$api.user.getList()
      this.allContacts = await this.$api.contact.getList()
    },
    submit() {
      // Must do validation explicitly for nested fields
      const isFormValid = this.$refs[this.formName].validate()
      if (isFormValid) {
        if (this.isEditing) this.submitUpdate()
        else this.submitSave()
      }
    },
    hasItemChanged() {
      const initial = JSON.stringify(this.apiRef.decompose(this.item))
      // cachedOrganization should already be decomposed and stringified
      return initial !== this.cachedItem
    }
  },
  computed: {
    isIfxOrg() {
      // Is this Organization from Nanites?
      return !!this.item.ifxOrg
    },
    title() {
      let rank = this.item.rank
      this.apiRef.validRanks.forEach((rankData) => {
        if (rankData.value === this.item.rank) {
          rank = rankData.text
        }
      })
      return `${this.item.name} (a ${this.item.orgTree} ${rank})`
    },
    orgTreeRules() {
      return [
        this.formRules.generic,
        v => (!v || v.toLowerCase() !== 'harvard') || "'Harvard' is a protected tree"
      ].flat()
    },
  },
}
</script>

<template>
  <v-container v-if='!isLoading'>
    <IFXPageHeader>
      <template #title>{{title}}</template>
      <template #content>{{description}}</template>
    </IFXPageHeader>
    <v-container>
      <v-form v-model='isValid' :ref="formName">
        <v-row>
          <v-col>
            <v-text-field
              v-model='item.name'
              label='Name'
              data-cy='name'
              :rules='formRules.generic'
              :error-messages='errors.name'
              required
              :disabled="isIfxOrg"
            ></v-text-field>
          </v-col>
          <v-col>
            <v-select
              v-model='item.rank'
              label='Rank'
              data-cy='rank'
              :rules='formRules.generic'
              :error-messages='errors.rank'
              :items="apiRef.validRanks"
              item-text="text"
              item-value="value"
              required
              :disabled="isIfxOrg"
            ></v-select>
          </v-col>
          <v-col>
            <v-text-field
              v-model='item.orgTree'
              label='Org tree'
              data-cy='org-tree'
              :rules='orgTreeRules'
              :error-messages='errors.org_tree'
              required
              :disabled="isIfxOrg"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <IFXItemSelectList
              :disabled="isIfxOrg"
              title='Users'
              :items.sync='item.users'
              :getEmptyItem='$api.organizationUser.create'
              >
              <template v-slot="{item}">
                <IFXSelectableUser :disabled="isIfxOrg" :allItems='allUsers' :item='item' :errors='errors'/>
              </template>
            </IFXItemSelectList>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <IFXItemSelectList
              title='Contacts'
              :items.sync='item.contacts'
              :getEmptyItem='$api.organizationContact.create'
              >
              <template v-slot="{item}">
                <IFXSelectableContact :allItems='allContacts' :item='item' :errors='errors'/>
              </template>
            </IFXItemSelectList>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <IFXButton btnType='submit' :disabled='!isSubmittable' @action='submit'/>
          </v-col>
        </v-row>
      </v-form>
    </v-container>
  </v-container>
</template>
