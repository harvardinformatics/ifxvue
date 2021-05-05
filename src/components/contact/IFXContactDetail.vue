<template>
  <v-container v-if='!isLoading'>
    <IFXPageHeader>
      <template #title>{{itemType}} Card for {{item.name}}</template>
      <template #cypress>{{id}}</template>
      <template #actions>
        <IFXButton btnType="edit" @action="navigateToItemEdit(id)"/>
      </template>
    </IFXPageHeader>
  <IFXContactCard :contact='item' :editBtn='false'/>
  </v-container>
</template>

<script>
import IFXContactCard from '@/components/contact/IFXContactCard'
import IFXContactMixin from '@/components/contact/IFXContactMixin'
import IFXItemDetailMixin from '@/components/item/IFXItemDetailMixin'

export default {
  name: 'IFXContactDetail',
  mixins: [IFXContactMixin, IFXItemDetailMixin],
  components: {
    IFXContactCard
  }
}
</script>
