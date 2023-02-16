<script>
import { mapActions } from 'vuex'
import IFXItemCreateEditMixin from '@/components/item/IFXItemCreateEditMixin'
import IFXItemSelectList from '@/components/item/IFXItemSelectList'
import IFXProductMixin from '@/components/product/IFXProductMixin'
import IFXPageActionBar from '@/components/page/IFXPageActionBar'

export default {
  name: 'IFXProductCreateEdit',
  mixins: [IFXProductMixin, IFXItemCreateEditMixin],
  components: {
    IFXItemSelectList,
    IFXPageActionBar,
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
    hasItemChanged() {
      const initial = JSON.stringify(this.apiRef.decompose(this.item))
      // cachedProduct should already be decomposed and stringified
      return initial !== this.cachedItem
    },
    priceHint(item) {
      return `Price per ${item.units ? `${item.units}` : 'unit'} in dollars`
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
      <v-form v-model="isValid" :ref="productForm">
        <v-row>
          <v-col>
            <v-text-field
              v-model="item.name"
              label="Name"
              data-cy="name"
              :rules="formRules.generic"
              :error-messages="errors.product_name"
              @keyup="$refs.productForm.resetValidation()"
              required
              @focus="clearError('product_name')"
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
              @focus="clearError('facility')"
            ></v-select>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-textarea
              v-model="item.description"
              label="Description"
              data-cy="description"
              :rules="formRules.generic"
              :error-messages="errors.product_description"
              @focus="clearError('product_description')"
              required
              auto-grow
              rows="2"
            ></v-textarea>
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
                        v-model="item.decimalPrice"
                        label="Price *"
                        :hint="priceHint(item)"
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
                        hint="Consult with FAS Informatics staff to ensure these are correct"
                        persistent-hint
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
                        hint="This value is used to signify usage quantity when this rate no longer applies (e.g. run time discounts)"
                        persistent-hint
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
        <IFXPageActionBar btnType="submit" :disabled="!isSubmittable" @action="submit" />
      </v-form>
    </v-container>
  </v-container>
</template>
