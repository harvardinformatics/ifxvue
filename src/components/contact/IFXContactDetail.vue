<template>
  <v-container v-if='!isLoading'>
    <IFXPageHeader>
      <template #title>{{itemType}} Card for {{item.name}}</template>
      <template #cypress>{{id}}</template>
      <template #actions>
        <IFXButton btnType="edit" @action="navigateToItemEdit(id)"/>
        <IFXDeleteItemButton :item='item' :apiRef='apiRef' :itemType='itemType'/>
      </template>
    </IFXPageHeader>
  <IFXContactCard :contact='item' :editBtn='false'/>
  </v-container>
</template>

<script>
import IFXContactCard from '@/components/contact/IFXContactCard'
import IFXContactMixin from '@/components/contact/IFXContactMixin'
import IFXItemDetailMixin from '@/components/item/IFXItemDetailMixin'
import IFXDeleteItemButton from '@/components/item/IFXDeleteItemButton'

export default {
  name: 'IFXContactDetail',
  mixins: [IFXContactMixin, IFXItemDetailMixin],
  components: {
    IFXContactCard,
    IFXDeleteItemButton
  }
}
</script>
