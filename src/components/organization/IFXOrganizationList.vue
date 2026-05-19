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
  props: {
    headers: {
      type: Array,
      required: false,
      default: () => [
        { text: 'ID', value: 'id', sortable: true, slot: true, click: true },
        { text: 'Name', value: 'name', sortable: true },
        { text: 'Rank', value: 'rank', sortable: true, slot: true },
        { text: 'Org tree', value: 'orgTree', sortable: true },
        { text: 'Parent(s)', value: 'parents', sortable: false, slot: true },
        { text: '', value: 'rowActionDetailEdit', sortable: false },
      ],
    },
  },
  data() {
    return {
      recipientField: '',
      selected: [],
    }
  },
  computed: {
    filteredHeaders() {
      return this.headers.filter((h) => !h.hide || !this.$vuetify.breakpoint[h.hide])
    },
  },
  methods: {
    onfs(slug) {
      return this.$options.filters.orgNameFromSlug(slug)
    },
    displayOrgRates(orgRates) {
      return orgRates.map((r) => {
        const startDate = r.startDate ? new Date(r.startDate) : null
        const endDate = r.endDate ? new Date(r.endDate) : null
        const now = new Date()
        const isActive = (!startDate || startDate <= now) && (!endDate || endDate >= now)
        const rateName = r.rate.name
        return isActive ? rateName : ''
      }).join(', ')
    },
    getSetItems() {
      // TODO: make this consistent, no api endpoint should be returning .data
      return (
        this.apiRef
          .getSkinnyList()
          .then((items) => {
            this.items = items
          })
          // TODO: work on handling this error
          .catch((error) => {
            this.showMessage(error)
            this.rtr.replace({ name: 'Home' })
          })
      )
    },
    emailLabManagers() {
      const organizationSlugs = this.selected.map((item) => item.slug)
      this.$router.push({
        name: 'MailingCompose',
        params: { labManagerOrgSlugs: organizationSlugs, recipientField: this.recipientField },
      })
    },
    updateSelected(selected) {
      this.$emit('update:selected', selected)
    },
  },
}
</script>

<template>
  <v-container>
    <IFXPageHeader>
      <template #title>{{ listTitle }}</template>
      <template #actions>
        <v-row nowrap align="center">
          <v-col>
            <IFXSearchField :search.sync="search" />
          </v-col>
          <v-col>
            <IFXMailButton
              v-model="recipientField"
              toolTip="Email Lab Managers"
              :disabled="!selected.length"
              @input="emailLabManagers()"
            ></IFXMailButton>
          </v-col>
          <slot name="buttons"></slot>
          <v-col>
            <IFXButton small btnType="add" @action="navigateToItemCreate" />
          </v-col>
        </v-row>
      </template>
    </IFXPageHeader>
    <IFXItemDataTable
      :items="filteredItems"
      :headers="filteredHeaders"
      :selected.sync="selected"
      :itemType="itemType"
      :loading="isLoading"
      @update:selected="updateSelected"
    >
      <template v-slot:parents="{ item }">
        {{ item.parents ? item.parents.map((p) => onfs(p)).join(', ') : '' }}
      </template>
      <template v-slot:rate="{ item }">
        {{ item.organizationRates ? displayOrgRates(item.organizationRates) : '' }}
      </template>
    </IFXItemDataTable>
    <slot name="extra-content"></slot>
  </v-container>
</template>
