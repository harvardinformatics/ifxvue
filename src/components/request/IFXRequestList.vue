<script>
import { debounce } from 'lodash'
import { mapActions } from 'vuex'
import IFXPageHeader from '@/components/page/IFXPageHeader'
import IFXSearchField from '@/components/IFXSearchField'

export default {
  name: 'IFXRequestList',
  components: {
    IFXPageHeader,
    IFXSearchField,
  },
  props: {
    headers: Array,
    dataFields: Array,
    requestType: String,
    title: String,
  },
  data() {
    return {
      lockedFieldTemplates: ['id', 'requestType', 'currentState', 'created', 'updated', 'result'],
      requests: [],
      includeCompleted: true,
      search: localStorage.getItem(`${this.$api.vars.appName}_RequestListSearch`) || '',
      loading: null,
      selected: [],
      rowsPerPage: parseInt(localStorage.getItem(`${this.$api.vars.appName}_RequestListRowsPerPage`)) || 10,
      rowsPerPageItems: [10, 20, { title: 'All', value: -1 }],
    }
  },
  computed: {
    computedHeaders() {
      return this.headers.filter((h) => !h.hide || !this.$vuetify.display[h.hide])
    },
    normalizedHeaders() {
      return this.computedHeaders.map((h) => ({
        ...h,
        key: h.key || h.value,
        title: h.title || h.text,
      }))
    },
    // Custom headers that are not locked
    customHeaders() {
      return this.headers
        .filter((n) => !this.lockedFieldTemplates.includes(n.value || n.key))
        .map((h) => ({
          ...h,
          key: h.key || h.value,
        }))
    },
  },
  methods: {
    display(header, item) {
      const value = header.key || header.value
      let result = item[value]
      if (header.display) {
        result = header.display(item[value])
      }
      return result
    },
    getDetailComponent(requestType) {
      return this.$requestApi.getRequestTypeDetailComponent(requestType)
    },
    getSlotName(header) {
      return `item.${header.key}`
    },
    getRequests: debounce(async function () {
      this.loading = true
      const me = this
      this.requests = await this.$requestApi
        .getRequestList(this.dataFields, this.search, this.includeCompleted, this.requestType)
        .catch((error) => {
          me.errored = true
          me.showMessage(error)
        })
      this.loading = false
    }, 1000),
    ...mapActions(['showMessage']),
  },
  mounted() {
    window.console.log('Mounted IFXRequestList with requestType', this.requestType)
    this.getRequests()
  },
  watch: {
    rowsPerPage: function () {
      localStorage.setItem(`${this.$api.vars.appName}_RequestListRowsPerPage`, this.rowsPerPage.toString())
    },
    search: function () {
      localStorage.setItem(`${this.$api.vars.appName}_RequestListSearch`, this.search)
      this.getRequests()
    },
    includeCompleted: function () {
      this.getRequests()
    },
  },
}
</script>

<template>
  <v-container class="fill-height">
    <IFXPageHeader>
      <template #title>{{ title }}</template>
      <template #actions>
        <v-row no-wrap align="center">
          <v-col>
            <IFXSearchField v-model:search="search" />
          </v-col>
          <v-col>
            <v-checkbox label="Include completed" v-model="includeCompleted" hide-details></v-checkbox>
          </v-col>
        </v-row>
      </template>
    </IFXPageHeader>
    <v-row class="flex-column fill-height w-100">
      <v-col cols="12">
          <v-data-table
            v-model="selected"
            :search="search"
            :headers="normalizedHeaders"
            v-model:items-per-page="rowsPerPage"
            :items="requests"
            :loading="loading"
            item-value="id"
            :items-per-page-options="rowsPerPageItems"
          >
            <template #loading>
              <v-progress-linear color="blue" indeterminate></v-progress-linear>
            </template>
            <template #no-data>
              <span class="text-grey-darken-1">No users returned</span>
            </template>
            <template v-slot:[`item.id`]="{ item }">
              <router-link
                class="no_decoration"
                :to="{ name: getDetailComponent(item.requestType), params: { id: item.id } }"
              >
                <span>{{ item.id }}</span>
              </router-link>
            </template>
            <template v-slot:[`item.requestType`]="{ item }">
              {{ $stateDisplay(item.requestType) }}
            </template>
            <template v-slot:[`item.currentState`]="{ item }">
              {{ $stateDisplay(item.currentState) }}
            </template>
            <template v-slot:[`item.created`]="{ item }">
              {{ $humanDatetime(item.created) }}
            </template>
            <template v-slot:[`item.updated`]="{ item }">
              {{ $humanDatetime(item.updated) }}
            </template>
            <template v-slot:[`item.result`]="{ item }">
              <v-icon v-if="item.result === 'SUCCESS'" color="green">mdi-thumb-up</v-icon>
              <v-icon v-else-if="item.result === 'REJECTED'" color="red">mdi-thumb-down</v-icon>
              <v-icon v-else-if="item.result === 'FAILED'" color="orange">mdi-message-alert</v-icon>
              <v-icon v-else-if="!item.result" color="grey">mdi-cached</v-icon>
              <span v-else>{{ item.result }}</span>
            </template>
            <template
              v-for="header in customHeaders"
              :key="header.key"
              v-slot:[getSlotName(header)]="{ item }"
            >
              <span v-if="header.custom">
                <slot :name="header.key" :item="item"></slot>
              </span>
              <span v-else>
                {{ display(header, item) }}
              </span>
            </template>
            <template #no-results>
              <v-alert :model-value="true" color="error" icon="mdi-alert">
                Your search found no results.
              </v-alert>
            </template>
          </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<style lang="scss" scoped>
.v-input--radio-group__input {
  margin-top: 1em;
}
table.compact tbody tr td {
  padding: 0 5px;
}
:deep(.v-data-table thead th) {
  text-align: left;
}
.v-card__title {
  border: none;
}
.w-100 {
  width: 100%;
}
</style>