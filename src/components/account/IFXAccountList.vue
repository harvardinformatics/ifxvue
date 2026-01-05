<script>
import IFXAccountMixin from '@/components/account/IFXAccountMixin'
import IFXItemDataTable from '@/components/item/IFXItemDataTable'
import IFXSearchField from '@/components/IFXSearchField'
import IFXItemListMixin from '@/components/item/IFXItemListMixin'

export default {
  name: 'AccountList',
  mixins: [IFXItemListMixin, IFXAccountMixin],
  components: {
    IFXSearchField,
    IFXItemDataTable,
  },
  computed: {
    headers() {
      const headers = [
        { title: 'ID', key: 'id', sortable: true },
        { title: 'Active', key: 'active', sortable: true, namedSlot: true },
        { title: 'Name', key: 'name', sortable: true },
        { title: 'Lab', key: 'organization', sortable: true, namedSlot: true },
        { title: 'Account Type', key: 'accountType', sortable: true },
        { title: 'Code', key: 'code', sortable: true, namedSlot: true },
        { title: 'Expiration Date', key: 'expirationDate', sortable: true, namedSlot: true },
        { title: 'Valid From', key: 'validFrom', sortable: true, hide: 'mdAndDown', namedSlot: true },
        { title: 'Created', key: 'created', sortable: true, hide: 'mdAndDown', namedSlot: true },
        { title: 'Updated', key: 'updated', hide: 'mdAndDown', sortable: true, namedSlot: true },
      ]
      return headers.filter((h) => !h.hide || !this.$vuetify.display[h.hide])
    },
  },
}
</script>

<template>
  <v-container>
    <IFXPageHeader>
      <template #title>Expense codes / POs</template>
      <template #actions>
        <IFXSearchField v-model:search="search" />
      </template>
    </IFXPageHeader>
    <IFXItemDataTable :loading="isLoading" :items="filteredItems" :headers="headers" v-model:selected="selected" :itemType="itemType">
      <template v-slot:active="{ item }">
        <v-icon v-if="item.active" color="green" size="small">mdi-check</v-icon>
        <v-icon v-else color="red" size="small">mdi-close</v-icon>
      </template>
      <template v-slot:organization="{ item }">
        {{ $orgNameFromSlug(item.organization) }}
      </template>
      <template v-slot:code="{ item }">
        <span style="white-space: nowrap">{{ item.code }}</span>
      </template>
      <template v-slot:expirationDate="{ item }">
        <span style="white-space: nowrap">{{ $columnDate(item.expirationDate) }}</span>
      </template>
      <template v-slot:validFrom="{ item }">
        <span style="white-space: nowrap">{{ $columnDate(item.validFrom) }}</span>
      </template>
      <template v-slot:created="{ item }">
        {{ $humanDatetime(item.created) }}
      </template>
      <template v-slot:updated="{ item }">
        {{ $humanDatetime(item.updated) }}
      </template>
    </IFXItemDataTable>
  </v-container>
</template>