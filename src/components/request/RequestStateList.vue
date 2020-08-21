<script>
export default {
  name: 'RequestStateList',
  props: {
    'request': Object,
    'validStates': Array,
    'requestApi': Object
  },
  data () {
    return {
      dialog: false,
      request_state: null,
      headers: [
        { text: 'Status', align: 'left', sortable: false, value: 'name' },
        { text: 'Updated', sortable: false, value: 'created' },
        { text: 'User', align: 'left', sortable: false, value: 'user' },
        { text: 'Comments', sortable: false, value: 'comment' }
      ]
    }
  },
  methods: {
    isUserApprover (request) {
      return this.requestApi.isUserApprover(request)
    },
    updateRequest () {
      let me = this
      if (this.request_state) {
        me.requestApi.setState(this.request.id, this.request_state)
          .then(() => {
            window.location.reload()
          })
          .catch((error) => {
            console.log(error)
          })
      }
    }
  }
}
</script>

<template>
  <v-card flat>
    <v-card-title>
      <v-layout row wrap justify-end align-center>
        <v-flex xs8>
          <div class="title">Request Status</div>
        </v-flex>
        <v-flex xs4>
          <v-layout row wrap justify-end align-center>
            <v-flex>
              <v-select
                label="Set state"
                v-model="request_state"
                :items="validStates"
                item-text="display"
                item-value="value"
                @change="updateRequest()"
              >
              </v-select>
            </v-flex>
          </v-layout>
        </v-flex>
      </v-layout>
    </v-card-title>
    <v-layout column>
      <v-flex>
        <v-data-table
          v-if="request.requestStates && request.requestStates.length"
          :headers="this.headers"
          :items="request.requestStates"
          class="elevation-1 mb-3"
          hide-actions
        >
          <template v-slot:items="props">
            <tr :class="{'can-be-approved': isUserApprover(request) && props.item.id === request.requestStates[0].id}">
              <td>{{props.item.name | stateDisplay}}</td>
              <td class="date-column">{{props.item.created | humanDatetime}}</td>
              <td>{{props.item.user.full_name == defaultApprover ? '' : props.item.user.full_name}}</td>
              <td>{{props.item.comment ? props.item.comment : "&nbsp;"}}</td>
            </tr>
          </template>
        </v-data-table>
      </v-flex>
    </v-layout>
  </v-card>
</template>
<style>

  table.v-table tbody td, table.v-table tbody th {
    padding: 8px;
    height: 20px;
  }

</style>
