<script>
import IFXMessageMixin from '@/components/message/IFXMessageMixin'
import IFXItemCreateEditMixin from '@/components/item/IFXItemCreateEditMixin'

export default {
  name: 'IFXMessageCreateEdit',
  mixins: [IFXMessageMixin, IFXItemCreateEditMixin],
  props: {
    selectedMessage: Object
  },
  methods: {
    async getItem() {
      if (this.selectedMessage) {
        return this.selectedMessage
      } if (this.isEditing) {
        return this.apiRef.getByID(this.id)
      }
      return this.apiRef.create()
    }
  }
}
</script>

<template>
  <v-container v-if="!isLoading">
    <IFXPageHeader>
      <template #title>{{title}}</template>
      <template #content>{{description}}</template>
    </IFXPageHeader>
    <v-container>
      <v-form v-if="!isLoading" v-model="isValid">
        <v-row>
          <v-col>
            <v-text-field
              v-model="item.name"
              label="Name"
              :rules="formRules.generic"
              :error-messages="errors.name"
              required
              ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-textarea
              v-model="item.message"
              label="Message"
              :rules="formRules.generic"
              :error-messages="errors.message"
              required
            ></v-textarea>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <IFXButton btnType="submit" @action="submit"/>
          </v-col>
        </v-row>
      </v-form>
    </v-container>
  </v-container>
</template>

<style>

</style>
