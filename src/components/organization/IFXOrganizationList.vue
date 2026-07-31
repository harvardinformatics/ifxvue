<script>
import IFXSearchField from '@/components/IFXSearchField'
import IFXItemDataTable from '@/components/item/IFXItemDataTable'
import IFXItemListMixin from '@/components/item/IFXItemListMixin'
import IFXOrganizationMixin from '@/components/organization/IFXOrganizationMixin'
import IFXMailButton from '@/components/mailing/IFXMailButton'

export default {
  name: 'IFXOrganizationList',
  inheritAttrs: false,
  mixins: [IFXOrganizationMixin, IFXItemListMixin],
  components: {
    IFXSearchField,
    IFXItemDataTable,
    IFXMailButton,
  },
  watch: {
    selected: {
      handler(newVal) {
        this.$emit('update:selected', newVal)
      },
      deep: true,
    },
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
    getDataForExport() {
      const formattedItems = []
      // Loop through filtered items
      for (let i = 0; i < this.filteredItems.length; i++) {
        const item = this.filteredItems[i]
        // Init new record, will be a row in the exported file
        const newRecord = {}
        // Loop through column headers
        for (let j = 0; j < this.headers.length; j++) {
          const header = this.headers[j]
          // Key used to access data
          const key = header.value
          // Formatted key for displayed that data in final file
          const formattedKey = header.text
          let value = item[key]
          // If value is undefined, but not false
          if (!value && value !== false) continue
          // TODO: make this check more generalized for multiple item types
          // Check for different item types
          if (value.fullName) {
            // If item is user or contact
            value = value.fullName
            // If item is organization
          } else if (value.slug) {
            value = value.slug
            // If item has date
          } else if (key.toLowerCase().includes('date')) {
            value = value.substring(0, 10)
          } else if (key === 'organizationRates') {
            value = this.displayOrgRates(value)
          } else if (key === 'parents') {
            value = value.map((p) => this.onfs(p)).join(', ')
          }
          newRecord[formattedKey] = value
        }
        formattedItems.push(newRecord)
      }
      return formattedItems
    },
    getItemsFilteredBySearch() {
      let items = this.items
      if (this.search) {
        const search = this.search.toString().toLowerCase()
        items = items.filter((i) => {
          let item = i
          if (i.data) {
            item = i.data
          }
          return Object.keys(item).some((j) => {
            let thingToBeSearched = item[j]
            if (j === 'organization_rates') {
              // If this is an array of rates, search the rate names instead
              thingToBeSearched = item[j].map((r) => r.rate.name).join(', ')
            }
            if (this.searchBooleans && typeof item[j] === 'boolean' && item[j]) {
              // If this is a boolean and true, search the key name instead
              thingToBeSearched = j
            }
            return this.filterSearch(thingToBeSearched, search)
          })
        })
      }
      return items
    },
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
      if (!this.$api?.organization) {
        return Promise.resolve()
      }
      return (
        this.$api.organization
          .getSkinnyList()
          .then((items) => {
            this.items = items
          })
          .catch((error) => {
            this.showMessage(error)
            this.$router.replace({ name: 'Home' })
          })
      )
    },
    emailLabManagers() {
      const organizationSlugs = this.selected.map((item) => item.slug)
      this.$router.push({
        name: 'MailingCompose',
        query: { recipientField: this.recipientField },
        state: {
          labManagerOrgSlugs: organizationSlugs,
          recipientField: this.recipientField,
        },
      })
    },
    updateSelected(selected) {
      this.$emit('update:selected', selected)
    },
  },
}
</script>

<template>
  <v-container fluid>
    <IFXPageHeader>
      <template #title>{{ listTitle }}</template>
      <template #actions>
        <v-row no-wrap align="center">
          <v-col>
            <IFXSearchField v-model:search="search" />
          </v-col>
          <v-col>
            <IFXMailButton
              v-model="recipientField"
              toolTip="Email Lab Managers"
              :disabled="!selected.length"
              @update:model-value="emailLabManagers()"
            ></IFXMailButton>
          </v-col>
          <slot name="buttons"></slot>
          <v-col>
            <v-tooltip top>
              <template v-slot:activator="{ props }">
                <div v-bind="props">
                  <download-csv
                    :class="{ 'download-disabled': isLoading }"
                    :labels="getLabelsForExport()"
                    :data="getDataForExport()"
                    :name="getNameForExport()"
                  >
                    <IFXButton
                      :disabled="isLoading"
                      small
                      class="download-btn"
                      btnType="download"
                    ></IFXButton>
                  </download-csv>
                </div>
              </template>
              <span>Download records in csv format</span>
            </v-tooltip>
          </v-col>
          <v-col>
            <IFXButton size="small" btnType="add" @action="navigateToItemCreate" />
          </v-col>
        </v-row>
      </template>
    </IFXPageHeader>
    <IFXItemDataTable
      :items="filteredItems"
      :headers="headers"
      v-model:selected="selected"
      :itemType="itemType"
      :loading="isLoading"
      :multi-sort="true"
      @update:selected="updateSelected"
    >
      <template v-slot:parents="{ item }">
        {{ item.parents ? item.parents.map((p) => onfs(p)).join(', ') : '' }}
      </template>
      <template v-slot:organizationRates="{ item }">
        {{ item.organizationRates ? displayOrgRates(item.organizationRates) : '' }}
      </template>
    </IFXItemDataTable>
    <slot name="extra-content"></slot>
  </v-container>
</template>