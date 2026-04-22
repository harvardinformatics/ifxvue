<script>
import { debounce } from 'lodash'
import { mapActions } from 'vuex'

export default {
  name: 'IFXRequestList',
  props: {
    headers: Array,
    dataFields: Array,
    requestType: String,
    title: String,
  },
  data() {
    return {
      lockedFieldTemplates: ['id', 'requestType', 'currentState', 'created', 'updated'], // table fields whose templates cannot be customized
      requests: [],
      includeCompleted: true,
      search: localStorage.getItem(`${this.$api.vars.appName}_RequestListSearch`) || '',
      loading: null,
      selected: [],
      rowsPerPage: parseInt(localStorage.getItem(`${this.$api.vars.appName}_RequestListRowsPerPage`)) || 10,
      rowsPerPageItems: [10, 20, { title: 'All', value: -1 }],
      sortBy: [
        {
          key: 'requestData.id',
          order: 'desc',
        },
      ],
    }
  },
  computed: {
    computedHeaders() {
      return this.headers.filter((h) => !h.hide || !this.$vuetify.breakpoint[h.hide])
    },
  },
  methods: {
    ...mapActions(['showMessage']),
    display(header, item) {
      let result = item[header.value]
      if (header.display) {
        result = header.display(item[header.value])
      }
      return result
    },
    getDetailComponent(requestType) {
      return this.$requestApi.getRequestTypeDetailComponent(requestType)
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
  },
  mounted() {
    this.getRequests()
  },
  watch: {
    rowsPerPage: function () {
      localStorage.setItem(`${this.$api.vars.appName}_RequestListRowsPerPage`, this.rowsPerPage.toString())
    },
    search: function () {
      localStorage.setItem(`${this.$api.vars.appName}_RequestListSearch`, this.search || '')
      this.getRequests()
    },
    includeCompleted: function () {
      this.getRequests()
    },
  },
}
</script>
<template>
  <v-container fill-height>
    <v-card>
      <v-card-title>
        <v-row align="start" justify-space-between style="padding: 10px">
          <v-col offset="2" cols="7">
            <v-row>
              <v-col>
                <v-text-field v-model="search" label="Search" single-line clearable hide-details></v-text-field>
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="3" class="py-0">
            <v-checkbox label="Include completed" v-model="includeCompleted"></v-checkbox>
          </v-col>
        </v-row>
      </v-card-title>
      <v-data-table
        v-model:search="search"
        v-model:sort-by="sortBy"
        :headers="computedHeaders"
        :items="requests"
        :loading="loading"
        class="elevation-1"
        item-value="requestData.id"
        :items-per-page-options="rowsPerPageItems"
      >
        <template v-slot:loader>
          <v-progress-linear color="blue" indeterminate></v-progress-linear>
        </template>
        <template v-slot:[`item.requestData.id`]="{ item }">
          <router-link
            class="no_decoration"
            :to="{ name: getDetailComponent(item.requestType), params: { id: item.id } }"
            exact
          >
            <span>{{ item.id }}</span>
          </router-link>
        </template>
        <template v-slot:[`item.requestData.result`]="{ item }">
          <span v-if="item.result">{{ $stateDisplay(item.result) }}</span>
          <span v-else class="text-grey text-grey-darken-1">None</span>
        </template>
        <template v-slot:[`item.requestData.current_state`]="{ item }">
          {{ $stateDisplay(item.currentState) }}
        </template>
        <template v-slot:[`item.requestData.created`]="{ item }">
          {{ $humanDatetime(item.created) }}
        </template>
        <template v-slot:[`item.requestData.updated`]="{ item }">
          {{ $humanDatetime(item.updated) }}
        </template>
        <template
          v-for="header in headers.filter((n) => !lockedFieldTemplates.includes(n.value))"
          v-slot:[`item.requestData.${header.value}`]="{ item }"
        >
          <span v-if="header.custom" v-bind:key="header.value">
            <slot :name="header.value" :item="item"></slot>
          </span>
          <span v-else v-bind:key="header.value">
            {{ display(header, item) }}
          </span>
        </template>
        <template v-slot:no-data>
          <v-alert color="error" icon="mdi-alert" border="start" variant="tonal" class="ma-4">
            Your search found no results.
          </v-alert>
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>

<style lang="scss" scoped>
.v-input--radio-group__input {
  margin-top: 1em;
}
table.compact tbody tr td {
  padding: 0 5px;
}
table.v-table thead th {
  text-align: left;
}
.v-card__title {
  border: none;
}
</style>
