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
    track: String,
    trackTitle: String,
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
    return {}
  },
}
</script>
<template>
  <v-container v-if="accountRequestData">
    <v-layout column>
      <v-flex>
        <span class="title">{{ trackTitle }}</span>
      </v-flex>
      <v-flex v-for="field in accountRequestData.tracks[track].fields.order" :key="field">
        <v-layout row wrap v-if="accountRequestData.tracks[track].fields[field]" justify-start>
          <v-flex class="field-label" xs12 md3 v-if="accountRequestData.tracks[track].fields[field].display_name">
            {{ accountRequestData.tracks[track].fields[field].display_name }}
          </v-flex>
          <v-flex class="field-label" xs12 md3 v-else>
            {{ field }}
          </v-flex>
          <v-flex xs12 md9 v-if="accountRequestData.tracks[track].fields[field].display_component">
            <component
              v-if="['harvard_key', 'project', 'lab_info', 'scientific_area', 'expense_code', 'terms_and_conditions'].includes(field)"
              :is="accountRequestData.tracks[track].fields[field].display_component"
              :data="accountRequestData[field]"
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
          <v-flex xs12 md9 v-else-if="!['mou', 'po'].includes(field)">
            <span v-if="accountRequestData.person[field]">{{ accountRequestData.person[field] }}</span>
            <span v-else>{{ accountRequestData[field] }}</span>
          </v-flex>
          <v-flex v-else></v-flex>
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
