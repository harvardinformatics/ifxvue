<script>
import moment from 'moment'
import { forEach, debounce } from 'lodash'
import { mapActions } from 'vuex'


export default {
  name: 'RequestList',
  props: {
    'requestApi': Object,
    'extraDataFields': {  /* fields pulled from the request.data object, e.g. ['data.rc_username', 'data.access_requests'] */
      'type': Array,
      'default': []
    },
    'storagePrefix': { /* prefix for localStorage items for the application, e.g. 'p3' */
      'type': String,
      'default': ''
    },
    'headers': {
      'type': Array,
      'default': [
        { text: 'ID', value: 'id' },
        { text: 'Request type', align: 'left', value: 'request_type' },
        { text: 'Status', align: 'left', value: 'current_state' },
        { text: 'Result', align: 'left', value: 'result' },
        { text: 'Requestor', value: 'requestor' },
        { text: 'Created', value: 'created' },
        { text: 'Updated', value: 'updated' }
      ]
    }
  },
  data () {
    return {
      requests: [],
      request_statuses: {},
      request_types: {},
      include_completed: true,
      search: localStorage.getItem(this.storagePrefix + 'RequestListSearch') || '',
      loading: null,
      selected: [],
      rowsPerPageItems: [10, 20, { 'text': 'All', 'value': -1 }],
      pagination: {},
      active_tab: null,
      headers: [
        { text: 'ID', value: 'id' },
        { text: 'Request type', align: 'left', value: 'request_type' },
        { text: 'Status', align: 'left', value: 'current_state' },
        { text: 'Result', align: 'left', value: 'result' },
        { text: 'Requestor', value: 'requestor' },
        { text: 'Access request code(s)', align: 'left', value: 'access_request_list' },
        { text: 'RC Username', align: 'left', value: 'rc_username' },
        { text: 'Created', value: 'created' },
        { text: 'Updated', value: 'updated' }
      ]
    }
  },
  filters: {
    columnDate (value) {
      let datestr = ''
      if (value) {
        datestr = moment(String(value)).format('M/DD/YYYY')
      }
      return datestr
    }
  },
  computed: {
    computedHeaders () {
      return this.headers.filter(h => !h.hide || !this.$vuetify.breakpoint[h.hide])
    }
  },
  methods: {
    getDetailComponent (requestType) {
      return this.requestApi.getRequestTypeDetailComponent(requestType)
    },
    getExtraDataFields () {
      // Search through the headers to find items with a "source" field and return those
      let extrafields = []
      forEach(this.headers, function (header) {
        if ('source' in header) {
          extrafields.push(header['source'])
        }
      })
      return extrafields
    },
    getRequests: debounce(function () {
      this.loading = true
      let me = this
      this.requests = []
      this.requestApi.getRequestList(this.getExtraDataFields.join(','), this.search, this.include_completed)
        .then(
          response => {
            forEach(response.data.requests, function (request) {
              let accessRequestList = []
              forEach(request['data.access_requests'], function (val, key) {
                if (val === 'Request') {
                  accessRequestList.push(key)
                }
              })
              request.rc_username = request['data.rc_username']
              request.access_request_list = accessRequestList.join(', ')
              me.requests.push(request)
            })
            this.loading = false
          }
        )
        .catch(error => {
          this.errored = true
          this.showMessage(error)
        })
    }, 1000),
    getRowsPerPage () {
      let rowsPref = parseInt(localStorage.getItem(this.storagePrefix + 'RequestsRowsPerPage'))
      if (!rowsPref) {
        localStorage.setItem(this.storagePrefix + 'RequestsRowsPerPage', '20')
        rowsPref = 20
      }
      this.$set(this.pagination, 'rowsPerPage', rowsPref)
    },
    updateRowsPerPage () {
      let rowsPref = this.pagination.rowsPerPage.toString()
      localStorage.setItem(this.storagePrefix + 'RequestsRowsPerPage', rowsPref)
    },
    ...mapActions([
      'showMessage'
    ])
  },
  mounted () {
    this.getRowsPerPage()
    this.getRequests()
  },
  watch: {
    pagination: {
      handler () {
        this.updateRowsPerPage()
      },
      deep: true
    },
    search: function () {
      localStorage.setItem(this.storagePrefix + 'AccountRequestListSearch', this.search)
      this.getRequests()
    },
    include_completed: function () {
      this.getRequests()
    }
  }
}
</script>
<template>
  <v-container fill-height>
    <v-layout column>
      <v-flex xs12>
        <v-card>
          <v-card-title>
            <v-layout row align-center justify-space-between>
              <v-flex xs3>
                <span class="headline">Requests</span>
              </v-flex>
              <v-flex grow>
                <v-layout row>
                  <v-flex>
                    <v-text-field
                        v-model="search"
                        label="Search"
                        single-line
                        hide-details
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs2>
                    <v-tooltip top>
                      <template slot="activator">
                        <v-btn :disabled="!search" fab small color="white" @click="search = ''">
                          <v-icon>clear</v-icon>
                        </v-btn>
                      </template>
                      <span>Clear search</span>
                    </v-tooltip>
                  </v-flex>
                </v-layout>
              </v-flex>
              <v-flex xs3>
                <v-checkbox label="Include completed" v-model="include_completed"></v-checkbox>
              </v-flex>
            </v-layout>
          </v-card-title>
          <v-data-table
            v-model="selected"
            :headers="computedHeaders"
            :pagination.sync="pagination"
            :rows-per-page-items="rowsPerPageItems"
            :items="requests"
            :loading="loading"
            item-key="id"
            class="elevation-1"
            disable-initial-sort
          >
          <v-progress-linear slot="progress" color="blue" indeterminate></v-progress-linear>
          <template slot="items" slot-scope="props">
            <tr :key="props.item.id">
              <td>
                <router-link class="no_decoration" :to="{name: getDetailComponent(props.item.request_type), params: {id:props.item.id}}" exact>
                  <span>{{props.item.id}}</span>
                </router-link>
              </td>
              <td>{{props.item.request_type | stateDisplay}}</td>
              <td>{{props.item.current_state | stateDisplay}}</td>
              <td>{{props.item.result}}</td>
              <td>{{props.item.requestor}}</td>
              <td>{{props.item.access_request_list}}</td>
              <td>{{props.item.rc_username}}</td>
              <td class="date-column">{{props.item.created | humanDatetime}}</td>
              <td class="date-column">{{props.item.updated | humanDatetime}}</td>
            </tr>
          </template>
            <v-alert slot="no-results" :value="true" color="error" icon="warning">
                Your search for "{{search}}" found no results.
            </v-alert>
          </v-data-table>
        </v-card>
      </v-flex>
    </v-layout>
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
