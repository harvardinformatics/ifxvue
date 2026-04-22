<script>

export default {
  name: 'IFXAccountRequestStateList',
  props: {
    request: Object,
    validStates: Array
  },
  data() {
    return {
      default_approver: this.$requestApi.getDefaultApprover(),
      dialog: false,
      request_state: null,
      headers: [
        { title: 'Status', align: 'start', sortable: false, key: 'name' },
        { title: 'Updated', sortable: false, key: 'created' },
        { title: 'User', align: 'start', sortable: false, key: 'user' },
        { title: 'Comments', sortable: false, key: 'comment' }
      ]
    }
  },
  methods: {
    isUserApprover(request) {
      return this.$requestApi.isUserApprover(request)
    },
    updateRequest() {
      const me = this
      if (this.request_state) {
        this.$requestApi.setState(this.request.id, this.request_state)
          .then(() => {
            me.$router.go()
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
      <v-row wrap justify-end align="center">
        <v-col xs8>
          <div class="text-body-1 font-weight-bold">Request Status</div>
        </v-col>
        <v-col xs4>
          <v-row wrap justify-end align="center">
            <v-col>
              <v-select
                label="Set state"
                v-model="request_state"
                :items="validStates"
                item-title="display"
                item-value="value"
                @update:model-value="updateRequest()"
              >
              </v-select>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-card-title>
    <v-row class="flex-column">
      <v-col>
        <v-data-table
          v-if="request.requestStates && request.requestStates.length"
          :headers="this.headers"
          :items="request.requestStates"
          class="elevation-1 mb-3"
          hide-default-footer
        >
            <template v-slot:[`item.name`]="{ item }">
                {{ $stateDisplay(item.name)  }}
            </template>
            <template v-slot:[`item.created`]="{ item }">
                {{ $humanDatetime(item.created) }}
            </template>
            <template v-slot:[`item.user`]="{ item }">
                {{ item.user.full_name == default_approver ? '' : item.user.full_name }}
            </template>
           <template v-slot:[`item.comment`]="{ item }">
                {{ item.comment ?  item.comment : "&nbsp;" }}
            </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-card>
</template>
<style>

  table.v-table tbody td, table.v-table tbody th {
    padding: 8px;
    height: 20px;
  }

</style>
