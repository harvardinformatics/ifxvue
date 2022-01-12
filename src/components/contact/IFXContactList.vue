<script>
/* eslint-disable no-unused-vars */
import IFXContactMixin from '@/components/contact/IFXContactMixin'
import IFXContactCard from '@/components/contact/IFXContactCard'
import IFXMailButton from '@/components/mailing/IFXMailButton'
import IFXSearchField from '@/components/IFXSearchField'
import IFXItemDataTable from '@/components/item/IFXItemDataTable'
import IFXItemListMixin from '@/components/item/IFXItemListMixin'

export default {
  name: 'IFXContactList',
  mixins: [IFXItemListMixin, IFXContactMixin],
  components: {
    IFXContactCard,
    IFXSearchField,
    IFXMailButton,
    IFXItemDataTable,
  },
  data() {
    return {
      focusedContact: {},
      recipientField: '',
    }
  },
  methods: {
    setFocusedContact(contact) {
      this.focusedContact = contact
    },
    composeEmail() {
      const recipients = this.selected.map((item) => item.detail).join(',')
      this.$router.push({ name: 'MailingCompose', params: { recipients: recipients, recipientField: this.recipientField } })
    }
  },
  computed: {
    headers() {
      const headers = [
        { text: 'Name', value: 'computedName', sortable: true },
        { text: 'Detail', value: 'detail', slot: true, sortable: true },
        { text: 'Created', value: 'created', namedSlot: true, sortable: true },
      ]
      return headers.filter((h) => !h.hide || !this.$vuetify.breakpoint[h.hide])
    },
    isContactContentLarge() {
      return !!this.$vuetify.breakpoint.mdAndUp
    },
    contactContentStyle() {
      return {
        display: 'flex',
        'flex-direction': this.isContactContentLarge ? 'row' : 'column',
        width: '600px'
      }
    }
  },
  mounted() {
    this.isLoading = true
    this.getSetItems()
      .then(() => this.focusedContact = this.items[0])
      .then(() => this.isLoading = false)
  }
}
</script>
<style lang="scss" scoped>
.full-width {
  width: 100%;
}
</style>
<template>
  <v-container v-if="!isLoading" fluid  grid-list-md>
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
              toolTip="Email contacts"
              :disabled="!selected.length"
              @input="composeEmail()"
            >
            </IFXMailButton>
          </v-col>
          <v-col>
            <IFXButton small btnType="add" @action="navigateToItemCreate"/>
          </v-col>
        </v-row>
      </template>
    </IFXPageHeader>
    <div :style='contactContentStyle'>
      <IFXItemDataTable
        class="full-width"
        :items='filteredItems'
        :headers='headers'
        :selected.sync='selected'
        :itemType='itemType'
        itemKey='key'
        @click-row='setFocusedContact'
      >
        <template v-slot:created="{ item }">
          <span style="white-space: nowrap;">{{ item.created|humanDatetime }}</span>
        </template>
      </IFXItemDataTable>
    </div>
    <div class="contact-card">
      <IFXContactCard :dense="isContactContentLarge" :contact="focusedContact"/>
    </div>
  </v-container>
</template>
<style scoped>
  .contact-card {
    position: fixed;
    right: 0.5em;
    top: 300px;
    background-color: white;
    z-index: 1000;
    width: 500px;
  }
</style>
