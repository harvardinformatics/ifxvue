<script>
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
        { text: '', value: 'rowActionEdit', slot: true }
      ]
      return headers.filter((h) => !h.hide || !this.$vuetify.breakpoint[h.hide])
    },
  },
  methods: {
    emailLabManagers() {
      const organizationSlugs = this.selected.map((item) => item.slug)
      this.$router.push({ name: 'MailingCompose', params: { labManagerOrgSlugs: organizationSlugs, recipientField: this.recipientField } })
    }
  }
}
</script>

<template>
  <v-container v-if="!isLoading">
    <IFXPageHeader>
      <template #title>{{listTitle}}</template>
      <template #actions>
        <v-row nowrap align="center">
          <v-col>
            <IFXSearchField :search.sync='search'/>
          </v-col>
          <v-col>
            <IFXMailButton
              v-model="recipientField"
              toolTip="Email Lab Managers"
              :disabled="!selected.length"
              @input="emailLabManagers()"
            >
            </IFXMailButton>
          </v-col>
          <v-col>
            <IFXButton small btnType="add" @action="navigateToItemCreate"/>
          </v-col>
        </v-row>
      </template>
    </IFXPageHeader>
    <IFXItemDataTable
      :items='filteredItems'
      :headers='headers'
      :selected.sync='selected'
      :itemType='itemType'
    />
  </v-container>
</template>
