<script>
import { mapActions } from 'vuex'
import IFXItemCreateEditMixin from '@/components/item/IFXItemCreateEditMixin'
import IFXItemSelectList from '@/components/item/IFXItemSelectList'
import IFXProductMixin from '@/components/product/IFXProductMixin'

export default {
  name: 'IFXProductCreateEdit',
  mixins: [IFXProductMixin, IFXItemCreateEditMixin],
  components: {
    IFXItemSelectList,
  },
  data() {
    return {
      formName: 'ProductForm',
      facilities: [],
    }
  },
  methods: {
    ...mapActions(['showMessage']),
    async init() {
      this.item = await this.getItem()
      this.allFacilities = await this.$api.facility.getList()
      this.cachedItem = JSON.stringify(this.apiRef.decompose(this.item))
    },
    submit() {
      // Must do validation explicitly for nested fields
      const isFormValid = this.$refs[this.formName].validate()
      if (isFormValid) {
        if (this.isEditing) this.submitUpdate()
        else this.submitSave()
      }
    },
    hasItemChanged() {
      const initial = JSON.stringify(this.apiRef.decompose(this.item))
      // cachedProduct should already be decomposed and stringified
      return initial !== this.cachedItem
    },
  },
  computed: {},
}
</script>

<template>
  <v-container v-if="!isLoading">
    <IFXPageHeader>
      <template #title>{{ title }}</template>
      <template #content>{{ description }}</template>
    </IFXPageHeader>
    <v-container>
      <v-form v-model="isValid" :ref="formName">
        <v-row>
          <v-col>
            <v-text-field
              v-model="item.name"
              label="Name"
              data-cy="name"
              :rules="formRules.generic"
              :error-messages="errors.name"
              required
            ></v-text-field>
          </v-col>
          <v-col>
            <v-select
              v-model="item.facility"
              label="Facility"
              data-cy="facility"
              :rules="formRules.generic"
              :error-messages="errors.facility"
              :items="allFacilities"
              item-text="name"
              item-value="id"
              required
            ></v-select>
          </v-col>
          <v-col>
            <v-text-field
              v-model="item.description"
              label="Description"
              data-cy="description"
              :rules="formRules.generic"
              :error-messages="errors.description"
              required
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <IFXItemSelectList title="Rates" :items.sync="item.rates" :getEmptyItem="$api.productRate.create">
              <template v-slot="{ item }">Rate editing goes here. {{ item }}</template>
            </IFXItemSelectList>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <IFXButton btnType="submit" :disabled="!isSubmittable" @action="submit" />
          </v-col>
        </v-row>
      </v-form>
    </v-container>
  </v-container>
</template>
