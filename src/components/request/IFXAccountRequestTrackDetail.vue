<script>
// Display data common to all account requests
import DisplayAddressList from './IFXDisplayAddressList'
import DisplayContactList from './IFXDisplayContactList'
import DisplayHarvardKey from './IFXDisplayHarvardKey'
import DisplayLabInfo from './IFXDisplayLabInfo'
import DisplayScientificArea from './IFXDisplayScientificArea'
import DisplayMOU from './IFXDisplayMOU'
import DisplayAffiliations from './IFXDisplayAffiliations'
import DisplayPO from './IFXDisplayPO'
import DisplayTermsAndConditions from './IFXDisplayTermsAndConditions'
import DisplayProject from './IFXDisplayProject'
import DisplayExpenseCode from './IFXDisplayExpenseCode'
import DisplayDemographicData from './IFXDisplayDemographicData'

export default {
  name: 'IFXAccountRequestTrackDetail',
  props: {
    accountRequestData: Object,
    track: String,
    trackTitle: String,
    organizations: {
      type: Array,
      required: false,
      default: [],
    },
  },
  data() {
    return {
      labInfoKey: 0
    }
  },
  components: {
    DisplayAddressList,
    DisplayContactList,
    DisplayHarvardKey,
    DisplayLabInfo,
    DisplayScientificArea,
    DisplayMOU,
    DisplayAffiliations,
    DisplayPO,
    DisplayTermsAndConditions,
    DisplayProject,
    DisplayExpenseCode,
    DisplayDemographicData,
  },
  mounted() {
    window.console.log('track detail for ', this.track)
    this.labInfoKey += 1
  },
}
</script>
<template>
  <v-container v-if="accountRequestData" >
    <v-row class="flex-column">
      <v-col cols="12">
        <span class="text-body-1 font-weight-bold">{{trackTitle}}</span>
      </v-col>
      <v-col cols="12" class="py-1" v-for="field in accountRequestData.tracks[track].fields.order" :key="field">
        <v-row density="compact" v-if="accountRequestData.tracks[track].fields[field]" justify-start>
          <v-col class="field-label" cols="2" v-if="accountRequestData.tracks[track].fields[field].display_name">
            {{accountRequestData.tracks[track].fields[field].display_name}}
          </v-col>
          <v-col class="field-label" cols="2" v-else>
            {{field}}
          </v-col>
          <v-col cols="10" v-if="accountRequestData.tracks[track].fields[field].display_component">
            <component v-if="field == 'harvard_key'"
              :is="accountRequestData.tracks[track].fields[field].display_component"
              :data="accountRequestData[field]">
            </component>
            <DisplayLabInfo v-else-if="field == 'lab_info'"
              :value="accountRequestData[field]"
              :organizations="organizations"
              :key="labInfoKey"
            >
            </DisplayLabInfo>
            <component v-else
              :is="accountRequestData.tracks[track].fields[field].display_component"
              :data="accountRequestData.person[field]">
            </component>
          </v-col>
          <v-col cols="10" v-else>
            <span v-if="accountRequestData.person[field]">{{accountRequestData.person[field]}}</span>
            <span v-else>{{accountRequestData[field]}}</span>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>
<style scoped>
  .field-label {
    font-weight: bold;
  }
</style>
