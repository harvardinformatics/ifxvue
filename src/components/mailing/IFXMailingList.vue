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
        { text: 'ID', value: 'id', namedSlot: true },
        { text: 'Sent', value: 'sent', sortable: true },
        { text: 'Subject', value: 'subject', sortable: true, width: '200px' },
        { text: 'From', hide: 'mdAndDown', value: 'fromstr' },
        { text: 'To', value: 'tostr', namedSlot: true, width: '300px' },
        { text: 'CC', hide: 'mdAndDown', value: 'ccstr', namedSlot: true, width: '300px' },
        { text: 'BCC', hide: 'mdAndDown', value: 'bccstr', namedSlot: true, width: '300px' },
        { text: 'Message', value: 'message', namedSlot: true },
        { text: 'Status', hide: 'mdAndDown', value: 'status' },
        { text: '', value: 'action', namedSlot: true, sortable: false },
      ]
      return headers.filter((h) => !h.hide || !this.$vuetify.breakpoint[h.hide])
    }
  },
  methods: {
    navigateToDetail(id) {
      this.rtr.push({
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
      console.log('mailing with params ', params)
      this.$router.push({ name: 'MailingCompose', params: params })
    }
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
    <template #id="{ item }">
      <a href="" @click.prevent="navigateToDetail(item.id)">{{item.id}}</a>
    </template>
    <template #tostr="{ item }">
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <span class="ellipse"
            v-bind="attrs"
            v-on="on"
          >
            {{item.tostr | commaSpace}}
          </span>
        </template>
        <span>{{item.tostr | commaSpace}}</span>
      </v-tooltip>
    </template>
    <template #ccstr="{ item }">
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <span class="ellipse"
            v-bind="attrs"
            v-on="on"
          >
            {{item.ccstr | commaSpace}}
          </span>
        </template>
        <span>{{item.ccstr | commaSpace}}</span>
      </v-tooltip>
    </template>
    <template #bccstr="{ item }">
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <span class="ellipse"
            v-bind="attrs"
            v-on="on"
          >
            {{item.bccstr | commaSpace}}
          </span>
        </template>
        <span>{{item.bccstr | commaSpace}}</span>
      </v-tooltip>
    </template>
    <template #message="{ item }">
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <span class="ellipse"
            v-bind="attrs"
            v-on="on"
          >
          {{item.message}}
          </span>
        </template>
        <span>{{item.message}}</span>
      </v-tooltip>
    </template>
    <template #action="{ item }">
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <span
            v-bind="attrs"
            v-on="on"
          >
          <v-btn
            xSmall
            fab
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
}
</style>
