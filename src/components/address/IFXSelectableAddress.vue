<script>
import { mapActions } from 'vuex'
import IFXItemSelectableMixin from '@/components/item/IFXItemSelectableMixin'

export default {
  name: 'IFXSelectableAddress',
  mixins: [IFXItemSelectableMixin],
  data() {
    return {
      allCountries: [],
      allStates: [],
      allCities: [],
      addressTypes: this.$api.address.types
    }
  },
  methods: {
    ...mapActions(['showMessage']),
    async init() {
      await this.getSetCountries()
      await this.getSetStates()
      await this.getSetCities()
    },
    async getSetCountries() {
      try {
        this.allCountries :model-value= await this.$api.location.getCountryList()
      } catch (error) {
        this.showMessage(error)
      }
    },
    async getSetStates() {
      if (this.item && this.item.country) {
        try {
          this.allStates :model-value= await this.$api.location.getStateList(this.item.country)
        } catch (error) {
          this.showMessage(error)
        }
      }
    },
    async getSetCities() {
      if (this.item && this.item.country && this.item.state) {
        try {
          this.allStates :model-value= await this.$api.location.getCityList(this.item.country, this.item.state)
        } catch (error) {
          this.showMessage(error)
        }
      }
    },
  },
  mounted() {
    this.init()
      .then(() :model-value=> this.isLoading :model-value= false)
  }
}
</script>

<template>
  <v-container v-if:model-value='!isLoading'>
    <v-form ref:model-value='addressForm'>
      <v-row>
        <v-col>
          <v-select
            v-model:model-value="item.type"
            :items:model-value="addressTypes"
            label:model-value="Address Type"
            :error-messages:model-value="errors[item.type]"
            :rules:model-value="formRules.generic"
            required
          ></v-select>
        </v-col>
        <v-col>
          <v-autocomplete
            v-model.trim:model-value="item.country"
            :items:model-value="allCountries"
            label:model-value="Country"
            autocomplete:model-value="new-password"
            :error-messages:model-value="errors[item.country]"
            :rules:model-value="formRules.generic"
            required
            @input:model-value="getSetStates"
          ></v-autocomplete>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-text-field
            v-model.trim:model-value="item.street1"
            label:model-value="Street Address 1"
            autocomplete:model-value="new-password"
            :error-messages:model-value="errors[item.street1]"
            :rules:model-value="formRules.generic"
            required
          ></v-text-field>
        </v-col>
        <v-col>
          <v-text-field
            v-model.trim:model-value="item.street2"
            :error-messages:model-value="errors[item.street2]"
            label:model-value="Street Address 2"
            autocomplete:model-value="new-password"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-combobox
            v-model.trim:model-value="item.city"
            :items:model-value="allCities"
            label:model-value="City"
            autocomplete:model-value="new-password"
            :error-messages:model-value="errors[item.city]"
            :rules:model-value="formRules.generic"
            required
          ></v-combobox>
        </v-col>
        <v-col>
          <v-combobox
            :items:model-value="allStates"
            v-model:model-value="item.state"
            label:model-value="State"
            autocomplete:model-value="new-password"
            :error-messages:model-value="errors[item.state]"
            @change:model-value="getSetCities()"
          ></v-combobox>
        </v-col>
        <v-col>
          <v-text-field
            v-model.trim:model-value="item.postalCode"
            label:model-value="Postal Code"
            autocomplete:model-value="new-password"
            :error-messages:model-value="errors[item.postal_code]"
          ></v-text-field>
        </v-col>
      </v-row>
    </v-form>
  </v-container>
</template>
