<script>
import IFXItemDataTable from '@/components/item/IFXItemDataTable'
import IFXItemListMixin from '@/components/item/IFXItemListMixin'
import IFXSearchField from '@/components/IFXSearchField'
import IFXMailingMixin from '@/components/mailing/IFXMailingMixin'

export default {
  name: 'IFXMailingList',
  mixins: [IFXMailingMixin, IFXItemListMixin],
  components: {
    IFXItemDataTable,
    IFXSearchField,
  },
  computed: {
    headers() {
      const headers = [
        { title: 'ID', value: 'id', namedSlot: true },
        { title: 'Sent', value: 'sent', sortable: true },
        { title: 'Subject', value: 'subject', sortable: true, width: '200px' },
        { title: 'From', value: 'fromstr' },
        { title: 'To', value: 'tostr', namedSlot: true, width: '300px' },
        { title: 'Message', value: 'message', namedSlot: true },
        { title: 'Status', value: 'status' },
        { title: '', value: 'action', namedSlot: true, sortable: false },
      ]
      return headers.filter((h) => !h.hide || !this.$vuetify.display[h.hide])
    }
  },
  methods: {
    navigateToDetail(id) {
      this.$router.push({
        name: 'MailingDetail',
        params: { id },
        query: { next: this.$route.path },
      })
    },
    composeEmail(item) {
      const params = {
        from: item.from,
        to: item.tostr,
        subject: item.subject,
        message: item.message,
      }
      if (item.ccstr) {
        params.cc = item.ccstr
      }
      if (item.bccstr) {
        params.bcc = item.bccstr
      }
      this.$router.push({ name: 'MailingCompose', params: params })
    }
  }
}
</script>

<template>
  <v-container>
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
      :loading='isLoading'
    >
      <template #id="{ item }">
        <a href="" @click.prevent="navigateToDetail(item.id)">{{item.id}}</a>
      </template>
      <template #tostr="{ item }">
        <v-tooltip location="bottom">
          <template v-slot:activator="{ props }">
          <span class="ellipse"
                v-bind="props"
          >
            {{ $commaSpace(item.tostr) }}
          </span>
          </template>
          <span>{{ $commaSpace(item.tostr) }}</span>
        </v-tooltip>
      </template>
      <template #message="{ item }">
        <v-tooltip location="bottom">
          <template v-slot:activator="{ props }">
          <span class="ellipse"
                v-bind="props"
                v-html="item.message"
          >
          </span>
          </template>
          <span v-html="item.message"></span>
        </v-tooltip>
      </template>
      <template #action="{ item }">
        <v-tooltip location="bottom">
          <template v-slot:activator="{ props }">
          <span
            v-bind="props"
          >
          <v-btn
            size="x-small"
            icon
            color="primary"
            @click="composeEmail(item)"
          >
            <v-icon color="white">mdi-email-send-outline</v-icon>
          </v-btn>
          </span>
          </template>
          <span>Compose a new email from this one</span>
        </v-tooltip>
      </template>
    </IFXItemDataTable>
  </v-container>
</template>

<style scoped>
.mailing-list-table {
  padding: 1rem;
}
.ellipse {
  max-width: 400px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: inline-block;
  max-height: 100px;
}
</style>