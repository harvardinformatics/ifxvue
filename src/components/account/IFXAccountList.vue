<script>
import IFXAccountMixin from '@/components/account/IFXAccountMixin'
import IFXItemDataTable from '@/components/item/IFXItemDataTable'
import IFXSearchField from '@/components/IFXSearchField'
import IFXItemListMixin from '@/components/item/IFXItemListMixin'

export default {
  // TODO: fix IFXAccountList in ifxvue and then use that
  name: 'AccountList',
  mixins: [IFXItemListMixin, IFXAccountMixin],
  components: {
    IFXSearchField,
    IFXItemDataTable,
  },
  computed: {
    headers() {
      const headers = [
        { text: 'ID', value: 'id', sortable: true },
        { text: 'Active', value: 'active', sortable: true, namedSlot: true },
        { text: 'Name', value: 'name', sortable: true },
        { text: 'Lab', value: 'organization', sortable: true, namedSlot: true },
        { text: 'Account Type', value: 'accountType', sortable: true },
        { text: 'Code', value: 'code', sortable: true, namedSlot: true },
        { text: 'Expiration Date', value: 'expirationDate', sortable: true, namedSlot: true },
        { text: 'Valid From', value: 'validFrom', sortable: true, hide: 'mdAndDown', namedSlot: true },
        { text: 'Created', value: 'created', sortable: true, hide: 'mdAndDown', namedSlot: true },
        { text: 'Updated', value: 'updated', hide: 'mdAndDown', sortable: true, namedSlot: true },
      ]
      return headers.filter((h) => !h.hide || !this.$vuetify.breakpoint[h.hide])
    },
  },
}
</script>

<template>
  <v-container v-if="!isLoading">
    <IFXPageHeader>
      <template #title>Expense codes / POs</template>
      <template #actions>
        <IFXSearchField :search.sync="search" />
      </template>
    </IFXPageHeader>
    <IFXItemDataTable :items="filteredItems" :headers="headers" :selected.sync="selected" :itemType="itemType">
      <template v-slot:active="{ item }">
        <v-icon v-if="item.active" color="green">check</v-icon>
        <v-icon v-else color="red">close</v-icon>
      </template>
      <template v-slot:lab="{ item }">
        {{ item.organization }}
      </template>
      <template v-slot:code="{ item }">
        <span style="white-space: nowrap">{{ item.code }}</span>
      </template>
      <template v-slot:expirationDate="{ item }">
        <span style="white-space: nowrap">{{ item.expirationDate | columnDate }}</span>
      </template>
      <template v-slot:validFrom="{ item }">
        <span style="white-space: nowrap">{{ item.validFrom | columnDate }}</span>
      </template>
      <template v-slot:created="{ item }">
        {{ item.created | humanDatetime }}
      </template>
      <template v-slot:updated="{ item }">
        {{ item.updated | humanDatetime }}
      </template>
    </IFXItemDataTable>
  </v-container>
</template>

<style scoped>
  .container {
    max-width: 1600px;
  }
</style>
