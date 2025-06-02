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
        <v-icon v-if="item.active" color="green">check</v-icon>
        <v-icon v-else color="red">close</v-icon>
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
