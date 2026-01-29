<script>
import IFXItemDetailMixin from '@/components/item/IFXItemDetailMixin'
import IFXLogChannelMixin from '@/components/channel/IFXLogChannelMixin'

export default {
  name: 'IFXLogChannelDetail',
  mixins: [IFXLogChannelMixin, IFXItemDetailMixin],
  data() {
    return {
    }
  },
  computed: {
  },
  methods: {
  },
}
</script>

<template>
  <v-container v-if="!isLoading">
    <IFXPageHeader>
      <template #title>{{ item.name }}</template>
      <template #cypress>{{ item.id }}</template>
      <template #actions>
        <IFXButton btnType="edit" xSmall @action="navigateToItemEdit(id)" />
      </template>
    </IFXPageHeader>
    <v-container px-5 py-0>
      <v-row justify="start" align="center" dense>
        <v-col sm="2">
          <h3>Name</h3>
        </v-col>
        <v-col>
          {{ item.name }}
        </v-col>
      </v-row>
    </v-container>
  </v-container>
</template>
