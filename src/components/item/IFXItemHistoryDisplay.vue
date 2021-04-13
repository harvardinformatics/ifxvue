<template>
  <v-row no-gutters>
    <v-col class="d-flex flex-column">
      <div><span class='text-subtitle font-weight-medium'>Updated on&nbsp;</span><span class="text-body-2">{{updatedDate}}</span></div>
      <div><span class='text-subtitle font-weight-medium'>Created on&nbsp;</span><span class="text-body-2">{{createdDate}}</span></div>
    </v-col>
  </v-row>
</template>

<script>
// Shows the created and modified dates for most IFX item types
export default {
  name: 'IFXItemHistoryDisplay',
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  computed: {
    updatedDate() {
      let updated
      if (this.item.lastUpdate) {
        updated = this.item.lastUpdate
      } else if (this.item.updated) {
        updated = this.item.updated
      } else if (this.item.dateUpdated) {
        updated = this.item.dateUpdated
      }
      return this.$options.filters.humanDatetime(updated)
    },
    createdDate() {
      let created
      if (this.item.dateJoined) {
        created = this.item.dateJoined
      } else if (this.item.created) {
        created = this.item.created
      } else if (this.item.dateCreated) {
        created = this.item.created
      }
      return this.$options.filters.humanDatetime(created)
    }
  }
}
</script>

<style scoped>
.history-subtitle {
  font-style: italic;
}
</style>
