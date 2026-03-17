<script>
import IFXSearchField from '@/components/IFXSearchField'
import IFXItemDataTable from '@/components/item/IFXItemDataTable'
import IFXMessageMixin from '@/components/message/IFXMessageMixin'
import IFXItemListMixin from '@/components/item/IFXItemListMixin'

export default {
  name: 'IFXMessageList',
  mixins: [IFXMessageMixin, IFXItemListMixin],
  components: {
    IFXSearchField,
    IFXItemDataTable
  },
  computed: {
    headers() {
      const headers = [
        { title: 'ID', key: 'id', sortable: true },
        { title: 'Name', key: 'displayName', sortable: true },
        { title: 'Subject', key: 'subject' },
        { title: 'Message', key: 'message' },
        { title: '', key: 'rowActionEdit' },  // No namedSlot needed - IFXDataTableCell handles it
        { title: '', key: 'actions', namedSlot: true, sortable: false },  // ✅ MUST have namedSlot: true
      ]
      return headers.filter((h) => !h.hide || !(this.$vuetify?.display?.[h.hide]))
    },
  },
  methods: {
    composeWithMessage(item) {
      this.$router.push({ name: 'MailingCompose', state: { messageName: item.name } })
    },
  }
}
</script>

<template>
  <v-container v-if="!isLoading">
    <IFXPageHeader>
      <template #title>{{listTitle}}</template>
      <template #actions>
        <IFXSearchField v-model:search='search'/>
        <IFXButton size="small" btnType="add" @action="navigateToItemCreate"/>
      </template>
    </IFXPageHeader>
    <IFXItemDataTable
      :items='filteredItems'
      :headers='headers'
      v-model:selected='selected'
      :itemType='itemType'
    >
      <template #actions="{ item }">
        <v-tooltip location="bottom">
          <template v-slot:activator="{ props }">
            <v-btn
              icon
              size="x-small"
              color="primary"
              @click="composeWithMessage(item)"
              v-bind="props"
            >
              <v-icon color="white">
                mdi-email-send-outline
              </v-icon>
            </v-btn>
          </template>
          <span>Compose an email with this message</span>
        </v-tooltip>
      </template>
    </IFXItemDataTable>
  </v-container>
</template>