<script>
/* eslint-disable no-unused-vars */
import IFXContactMixin from '@/components/contact/IFXContactMixin'
import IFXContactCard from '@/components/contact/IFXContactCard'
import IFXActionSelect from '@/components/action/IFXActionSelect'
import IFXSearchField from '@/components/IFXSearchField'
import IFXItemDataTable from '@/components/item/IFXItemDataTable'
import IFXItemListMixin from '@/components/item/IFXItemListMixin'

export default {
  name: 'IFXContactList',
  mixins: [IFXContactMixin, IFXItemListMixin],
  components: {
    IFXContactCard,
    IFXSearchField,
    IFXActionSelect,
    IFXItemDataTable,
  },
  data() {
    return {
      focusedContact: {}
    }
  },
  methods: {
    setFocusedContact(contact) {
      this.focusedContact = contact
    }
  },
  computed: {
    headers() {
      const headers = [
        { text: 'Name', value: 'name', sortable: true },
        { text: 'Detail', value: 'detail', slot: true, sortable: true },
      ]
      return headers.filter((h) => !h.hide || !this.$vuetify.breakpoint[h.hide])
    },
    isContactContentLarge() {
      return !!this.$vuetify.breakpoint.mdAndUp
    },
    contactContentStyle() {
      return {
        display: 'flex',
        'flex-direction': this.isContactContentLarge ? 'row' : 'column'
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
<template>
  <v-container v-if="!isLoading" fluid  grid-list-md>
    <IFXPageHeader>
      <template #title>{{listTitle}}</template>
      <template #actions>
        <IFXSearchField :search.sync='search'/>
        <IFXActionSelect
          :actionKeys="['addMailingTo', 'addMailingCC', 'addMailingBCC', 'deleteContacts']"
          :apiRef='apiRef'
          @get-set-items='getSetItems'
          :selectedItems.sync='selected'
        />
        <IFXButton btnType="add" small @action="navigateToItemCreate"/>
      </template>
    </IFXPageHeader>
    <div :style='contactContentStyle'>
      <IFXContactCard v-if='!isContactContentLarge' dense :contact='focusedContact'/>
      <IFXItemDataTable
        :items='filteredItems'
        :headers='headers'
        :selected.sync='selected'
        :itemType='itemType'
        @click-row='setFocusedContact'
      />
      <IFXContactCard v-if='isContactContentLarge' :contact='focusedContact'/>
    </div>
  </v-container>
</template>
