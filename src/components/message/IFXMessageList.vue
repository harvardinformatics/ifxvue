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
        { text: 'ID', value: 'id', sortable: true },
        { text: 'Subject', value: 'subject' },
        { text: 'Message', value: 'message' },
        { text: '', value: 'rowActionEdit', slot: true },
        { text: '', value: 'actions', namedSlot: true, sortable: false },
      ]
      return headers.filter((h) => !h.hide || !this.$vuetify.breakpoint[h.hide])
    },
  },
  methods: {
    composeWithMessage(item) {
      this.$router.push({ name: 'MailingCompose', params: { messageName: item.name } })
    },
  }
}
</script>

<template>
  <v-container v-if="!isLoading">
    <IFXPageHeader>
      <template #title>{{listTitle}}</template>
      <template #actions>
        <IFXSearchField :search.sync='search'/>
        <IFXButton small btnType="add" @action="navigateToItemCreate"/>
      </template>
    </IFXPageHeader>
    <IFXItemDataTable
      :items='filteredItems'
      :headers='headers'
      :selected.sync='selected'
      :itemType='itemType'
    >
      <template #actions="{ item }">
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              fab
              small
              color="primary"
              @click="composeWithMessage(item)"
              v-bind="attrs"
              v-on="on"
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
