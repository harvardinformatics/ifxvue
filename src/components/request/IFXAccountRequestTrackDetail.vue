<script>
// Display data common to all account requests
import DisplayAddressList from './IFXDisplayAddressList'
import DisplayContactList from './IFXDisplayContactList'
import DisplayHarvardKey from './IFXDisplayHarvardKey'
import DisplayDemographicData from './IFXDisplayDemographicData'
import DisplayMOU from './IFXDisplayMOU'
import DisplayProject from './IFXDisplayProject'
import DisplayPO from './IFXDisplayPO'
import DisplayLabInfo from './IFXDisplayLabInfo'
import DisplayScientificArea from './IFXDisplayScientificArea'
import DisplayExpenseCode from './IFXDisplayExpenseCode'
import DisplayTermsAndConditions from './IFXDisplayTermsAndConditions'
import DisplayAffiliations from './IFXDisplayAffiliations'

export default {
  name: 'IFXAccountRequestTrackDetail',
  props: {
    accountRequestData: Object,
    accountRequest: Object, // Sorry about having to pass this in, but it's needed for the updateAccountRequest call
    track: String,
    trackTitle: String,
    organizations: Array,
  },
  components: {
    DisplayAddressList,
    DisplayContactList,
    DisplayHarvardKey,
    DisplayDemographicData,
    DisplayMOU,
    DisplayPO,
    DisplayProject,
    DisplayLabInfo,
    DisplayScientificArea,
    DisplayExpenseCode,
    DisplayTermsAndConditions,
    DisplayAffiliations,
  },
  data() {
    return {
      localData: this.accountRequestData,
      localAccountRequest: this.accountRequest,
    }
  },
  methods: {
    updateData() {
      if (this.localAccountRequest.onBoardRequest) {
        this.localAccountRequest.onBoardRequest.data = this.localData
        this.$requestApi.updateAccountRequest(this.localAccountRequest)
      }
    },
  },
}
</script>
<template>
  <v-container v-if="accountRequestData && organizations">
    <v-layout column>
      <v-flex>
        <span class="title">{{ trackTitle }}</span>
      </v-flex>
      <v-flex v-for="field in accountRequestData.tracks[track].fields.order" :key="field">
        <v-layout row wrap v-if="accountRequestData.tracks[track].fields[field] && !['mou', 'po'].includes(field)" justify-start>
          <v-flex class="field-label" xs12 md3 v-if="accountRequestData.tracks[track].fields[field].display_name">
            {{ accountRequestData.tracks[track].fields[field].display_name }}
          </v-flex>
          <v-flex class="field-label" xs12 md3 v-else>
            {{ field }}
          </v-flex>
          <v-flex xs12 md9 v-if="accountRequestData.tracks[track].fields[field].display_component">
            <component
              v-if="['harvard_key', 'project', 'scientific_area', 'expense_code', 'terms_and_conditions'].includes(field)"
              :is="accountRequestData.tracks[track].fields[field].display_component"
              :data="accountRequestData[field]"
            ></component>
            <component
              v-else-if="field == 'lab_info'"
              :is="accountRequestData.tracks[track].fields[field].display_component"
              v-model="localData"
              :organizations="organizations"
              @change="updateData()"
            ></component>
            <component
              v-else-if="['demographic_data', 'primary_affiliation'].includes(field)"
              :is="accountRequestData.tracks[track].fields[field].display_component"
              :data="accountRequestData.person"
            ></component>
            <component
              v-else
              :is="accountRequestData.tracks[track].fields[field].display_component"
              :data="accountRequestData.person[field]"
            ></component>
          </v-flex>
          <v-flex v-else>{{ accountRequestData.person[field] }}</v-flex>
          <v-flex></v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<style scoped>
.field-label {
  font-weight: bold;
}
</style>
