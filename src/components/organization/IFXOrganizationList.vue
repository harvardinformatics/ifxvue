<script>
import * as has from 'lodash/has'
import IFXSearchField from '@/components/IFXSearchField'
import IFXItemDataTable from '@/components/item/IFXItemDataTable'
import IFXItemListMixin from '@/components/item/IFXItemListMixin'
import IFXOrganizationMixin from '@/components/organization/IFXOrganizationMixin'
import IFXMailButton from '@/components/mailing/IFXMailButton'

export default {
  name: 'IFXOrganizationList',
  mixins: [IFXOrganizationMixin, IFXItemListMixin],
  components: {
    IFXSearchField,
    IFXItemDataTable,
    IFXMailButton,
  },
  data() {
    return {
      recipientField: '',
    }
  },
  computed: {
    headers() {
      const headers = [
        { text: 'ID', value: 'id', sortable: true, slot: true, click: true },
        { text: 'Name', value: 'name', sortable: true },
        { text: 'Rank', value: 'rank', sortable: true, slot: true },
        { text: 'Org tree', value: 'orgTree', sortable: true },
        { text: 'Parent(s)', value: 'parents', sortable: false, slot: true },
        { text: '', value: 'rowActionDetailEdit', sortable: false },
      ]
      return headers.filter((h) => !h.hide || !this.$vuetify.breakpoint[h.hide])
    },
  },
  methods: {
    getSetItems() {
      // TODO: make this consistent, no api endpoint should be returning .data
      return (
        this.apiRef
          .getSkinnyList()
          .then((items) => {
            if (has(items, 'data')) {
              console.error('getList should return a list of formatted objects')
            }
            this.items = items
          })
          // TODO: work on handling this error
          .catch((error) => {
            this.showMessage(error)
            this.rtr.replace({ name: 'Home' })
          })
      )
    },
    emailLabManagers() {
      const organizationSlugs = this.selected.map((item) => item.slug)
      this.$router.push({
        name: 'MailingCompose',
        params: { labManagerOrgSlugs: organizationSlugs, recipientField: this.recipientField },
      })
    },
  },
}
</script>

<template>
  <v-container>
    <IFXPageHeader>
      <template #title>{{ listTitle }}</template>
      <template #actions>
        <v-row nowrap align="center">
          <v-col>
            <IFXSearchField :search.sync="search" />
          </v-col>
          <v-col>
            <IFXMailButton
              v-model="recipientField"
              toolTip="Email Lab Managers"
              :disabled="!selected.length"
              @input="emailLabManagers()"
            ></IFXMailButton>
          </v-col>
          <v-col>
            <IFXButton small btnType="add" @action="navigateToItemCreate" />
          </v-col>
        </v-row>
      </template>
    </IFXPageHeader>
    <IFXItemDataTable
      :items="filteredItems"
      :headers="headers"
      :selected.sync="selected"
      :itemType="itemType"
      :loading="isLoading"
    />
  </v-container>
</template>
