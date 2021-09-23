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
      allFacilities: [],
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
      if (this.isEditing) this.submitUpdate()
      else this.submitSave()
    },
    hasItemChanged() {
      const initial = JSON.stringify(this.apiRef.decompose(this.item))
      // cachedProduct should already be decomposed and stringified
      return initial !== this.cachedItem
    },
  },
  computed: {
    title() {
      const itemTitle = this.splitOnCapitals(this.itemType).join(' ')
      if (this.isEditing) {
        return `Edit ${itemTitle} ${this.item.name}`
      }
      return `Create ${itemTitle}`
    },
  },
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
              item-value="name"
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
              <template v-slot="{ item }">
                <v-container>
                  <v-row>
                    <v-col>
                      <v-text-field
                        v-model="item.name"
                        label="Name *"
                        :rules="formRules.generic"
                        data-cy="rate-name"
                        :error-messages="errors.name"
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col>
                      <v-text-field
                        v-model="item.dollarValue"
                        label="Price *"
                        hint="Price per unit in dollars"
                        :rules="formRules.currency"
                        type="number"
                        data-cy="rate-price"
                        :error-messages="errors.name"
                        required
                        prefix="$"
                      ></v-text-field>
                    </v-col>
                    <v-col>
                      <v-text-field
                        v-model="item.units"
                        label="Units *"
                        :rules="formRules.generic"
                        data-cy="rate-units"
                        :error-messages="errors.units"
                        required
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12" md="4">
                      <v-text-field
                        v-model="item.maxQty"
                        label="Max Quantity"
                        type="number"
                        data-cy="rate-maxQty"
                        :error-messages="errors.maxQty"
                      ></v-text-field>
                    </v-col>
                    <v-col>
                      <v-switch v-model="item.active" label="Active" data-cy="rate-active"></v-switch>
                    </v-col>
                  </v-row>
                </v-container>
              </template>
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
