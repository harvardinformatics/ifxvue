<script>
import IFXMessageMixin from '@/components/message/IFXMessageMixin'
import IFXItemDetailMixin from '@/components/item/IFXItemDetailMixin'

export default {
  name: 'IFXMessageDetail',
  mixins: [IFXMessageMixin, IFXItemDetailMixin],
  props: {
    selectedMessage: Object
  },
  computed: {
    title() {
      return this.item.displayName ? `${this.item.displayName} Message` : `${this.item.name} Message`
    }
  },
  methods: {
    async getItem() {
      // If message is passed as prop by router
      if (this.selectedMessage) {
        return this.selectedMessage
      }
      return this.apiRef.getByID(this.id)
    },
  },
}
</script>

<template>
  <v-container v-if="!loading">
    <IFXPageHeader>
      <template #title>{{ title }}</template>
      <template #cypress>{{ id }}</template>
      <template #actions>
        <IFXButton btnType="edit" @action="navigateToItemEdit(id)"/>
      </template>
    </IFXPageHeader>
    <v-container px-5 py-0>
      <v-row>
        <v-col>
          <h3>Subject</h3>
          <p>{{item.subject}}</p>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <h3>Message</h3>
          <p v-html="item.message"></p>
        </v-col>
      </v-row>
    </v-container>
  </v-container>
</template>
