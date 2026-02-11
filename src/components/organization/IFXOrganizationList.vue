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
  data() {
    return {
      recipientField: '',
    }
  },
  computed: {
    headers() {
      const headers = [
        { title: 'ID', key: 'id', sortable: true, slot: true, click: true },
        { title: 'Name', key: 'name', sortable: true },
        { title: 'Rank', key: 'rank', sortable: true, slot: true },
        { title: 'Org tree', key: 'orgTree', sortable: true },
        { title: 'Parent(s)', key: 'parents', sortable: false, namedSlot: true },
        { title: '', key: 'rowActionDetailEdit', sortable: false },
      ]
      return headers.filter((h) => !h.hide || !this.$vuetify.display[h.hide])
    },
  },
  watch: {
    selected: {
      handler(newVal) {
        this.$emit('update:selected', newVal)
      },
      deep: true,
    },
  },
  methods: {
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
    >
      <template #parents="{ item }">
        {{ item.parents ? item.parents.join(', ') : '' }}
      </template>
    </IFXItemDataTable>
    <slot name="buttons"></slot>
    <slot name="extra-content"></slot>
  </v-container>
</template>