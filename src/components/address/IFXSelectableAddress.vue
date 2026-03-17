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
        this.allCountries = await this.$api.location.getCountryList()
      } catch (error) {
        this.showMessage(error)
      }
    },
    async getSetStates() {
      if (this.item && this.item.country) {
        try {
          this.allStates = await this.$api.location.getStateList(this.item.country)
        } catch (error) {
          this.showMessage(error)
        }
      }
    },
    async getSetCities() {
      if (this.item && this.item.country && this.item.state) {
        try {
          this.allStates = await this.$api.location.getCityList(this.item.country, this.item.state)
        } catch (error) {
          this.showMessage(error)
        }
      }
    },
  },
  mounted() {
    this.init()
      .then(() => this.isLoading = false)
  }
}
</script>

<template>
  <v-container v-if='!isLoading'>
    <v-form ref='addressForm'>
      <v-row>
        <v-col>
          <v-select
            v-model="item.type"
            :items="addressTypes"
            label="Address Type"
            :error-messages="errors[item.type]"
            :rules="formRules.generic"
            required
          ></v-select>
        </v-col>
        <v-col>
          <v-autocomplete
            v-model.trim="item.country"
            :items="allCountries"
            label="Country"
            autocomplete="new-password"
            :error-messages="errors[item.country]"
            :rules="formRules.generic"
            required
            @input="getSetStates"
          ></v-autocomplete>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-text-field
            v-model.trim="item.street1"
            label="Street Address 1"
            autocomplete="new-password"
            :error-messages="errors[item.street1]"
            :rules="formRules.generic"
            required
          ></v-text-field>
        </v-col>
        <v-col>
          <v-text-field
            v-model.trim="item.street2"
            :error-messages="errors[item.street2]"
            label="Street Address 2"
            autocomplete="new-password"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-combobox
            v-model.trim="item.city"
            :items="allCities"
            label="City"
            autocomplete="new-password"
            :error-messages="errors[item.city]"
            :rules="formRules.generic"
            required
          ></v-combobox>
        </v-col>
        <v-col>
          <v-combobox
            :items="allStates"
            v-model="item.state"
            label="State"
            autocomplete="new-password"
            :error-messages="errors[item.state]"
            @change="getSetCities()"
          ></v-combobox>
        </v-col>
        <v-col>
          <v-text-field
            v-model.trim="item.postalCode"
            label="Postal Code"
            autocomplete="new-password"
            :error-messages="errors[item.postal_code]"
          ></v-text-field>
        </v-col>
      </v-row>
    </v-form>
  </v-container>
</template>
