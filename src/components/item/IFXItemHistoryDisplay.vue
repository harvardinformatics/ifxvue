<template>
  <v-row>
    <v-col>
      <span class='history-subtitle'>Updated: </span><span>{{updatedDate}}</span>
    </v-col>
    <v-col>
      <span class='history-subtitle'>Created: </span><span>{{createdDate}}</span>
    </v-col>
  </v-row>
</template>

<script>
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
