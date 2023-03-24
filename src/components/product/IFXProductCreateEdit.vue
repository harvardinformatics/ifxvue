<script>
import { mapActions } from 'vuex'
import IFXItemCreateEditMixin from '@/components/item/IFXItemCreateEditMixin'
import IFXItemSelectList from '@/components/item/IFXItemSelectList'
import IFXProductMixin from '@/components/product/IFXProductMixin'
import IFXPageActionBar from '@/components/page/IFXPageActionBar'
import IFXItemDataTable from '@/components/item/IFXItemDataTable'

export default {
  name: 'IFXProductCreateEdit',
  mixins: [IFXProductMixin, IFXItemCreateEditMixin],
  components: {
    IFXItemSelectList,
    IFXPageActionBar,
    IFXItemDataTable,
  },
  data() {
    return {
      allFacilities: [],
      newRates: [],
      selected: [],
      showDeactivatedRates: false,
    }
  },
  methods: {
    ...mapActions(['showMessage']),
    async init() {
      this.item = await this.getItem()
      this.item.rates.forEach((rate) => {
        // Save the original active state so we can filter out deactivated rates
        // eslint-disable-next-line no-param-reassign
        rate.originalActive = rate.active
      })

      this.allFacilities = await this.$api.facility.getList()
      this.cachedItem = JSON.stringify(this.apiRef.decompose(this.item))
    },
    hasItemChanged() {
      const current = JSON.stringify(this.apiRef.decompose(this.item))
      // cachedProduct should already be decomposed and stringified
      return current !== this.cachedItem || this.newRates.length > 0
    },
    priceHint(item) {
      return `Price per ${item.units ? `${item.units}` : 'unit'} in dollars`
    },
    submit() {
      // Remove the orginal active state
      this.item.rates.forEach((rate) => {
        // eslint-disable-next-line no-param-reassign
        delete rate.originalActive
      })
      // Append any new rates to the end
      this.item.rates = this.item.rates.concat(this.newRates)
      if (this.isEditing) this.submitUpdate()
      else this.submitSave()
    },
    pluralize(count, string) {
      return `${count} ${string}${count === 1 ? '' : 's'}`
    },
  },
  computed: {
    headers() {
      const headers = [
        { text: 'Name', value: 'name', sortable: true },
        { text: 'Price', value: 'price', sortable: true },
        { text: 'Units', value: 'units', sortable: true, slot: true },
        { text: 'Max Quantity', value: 'maxQty', sortable: false, namedSlot: true },
        { text: 'Active', value: 'active', sortable: true, namedSlot: true },
      ]
      return headers.filter((h) => !h.hide || !this.$vuetify.breakpoint[h.hide])
    },
    title() {
      const itemTitle = this.splitOnCapitals(this.itemType).join(' ')
      if (this.isEditing) {
        return `Edit ${itemTitle} ${this.item.name}`
      }
      return `Create ${itemTitle}`
    },
    filteredRates() {
      if (this.item?.rates) {
        return this.item.rates.filter((r) => r.originalActive || this.showDeactivatedRates)
      }
      return []
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
            <IFXItemSelectList
              title="Rates"
              :items.sync="newRates"
              :getEmptyItem="$api.productRate.create"
              noItemsString=""
            >
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
            <v-row>
              <v-col class="d-flex justify-end">
                <v-checkbox
                  class="mt-0 pt-0"
                  v-model="showDeactivatedRates"
                  label="Show deactivated rates"
                  data-cy="show-deactivated-rates"
                ></v-checkbox>
              </v-col>
            </v-row>
            <IFXItemDataTable
              :items="filteredRates"
              :headers="headers"
              :selected.sync="selected"
              itemType="ProductRate"
              :showSelect="false"
            >
              <template #active="{ item }">
                <v-switch
                  v-if="item.originalActive"
                  v-model="item.active"
                  label="Active"
                  data-cy="rate-active-toggle"
                ></v-switch>
                <span v-else>Deactivated</span>
              </template>
              <template #maxQty="{ item }">
                {{ item.maxQty ? `${pluralize(item.maxQty, item.units)}` : '∞' }}
              </template>
            </IFXItemDataTable>
          </v-col>
        </v-row>
        <IFXPageActionBar btnType="submit" :disabled="!isSubmittable" @action="submit" />
      </v-form>
    </v-container>
  </v-container>
</template>
