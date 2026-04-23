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
import DisplayEnteredAffiliation from './IFXDisplayEnteredAffiliation'
import DisplaySimpleText from './IFXDisplaySimpleText'

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
    DisplayEnteredAffiliation,
    DisplaySimpleText,
  },
  data() {
    return {
      localData: this.accountRequestData,
      localAccountRequest: this.accountRequest,
    }
  },
  methods: {
    getTrackClass(track) {
      if (track !== 'general') {
        return 'my-4'
      }
      return 'my-0'
    },
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
    <v-row class="my-2">
      <v-col class="text-title-large">
        {{ trackTitle }}
      </v-col>
    </v-row>
    <v-row v-for="field in accountRequestData.tracks[track].fields.order" :key="field" cols="12" align="start" :class="getTrackClass(track)">
      <v-col cols="4" class="field-label" style="flex-basis: 30%; max-width: 30%;" v-if="accountRequestData.tracks[track].fields[field] && !['mou', 'po'].includes(field)">
        <template v-if="accountRequestData.tracks[track].fields[field].display_name">
          {{ accountRequestData.tracks[track].fields[field].display_name }}
        </template>
        <template v-else>
          {{ field }}
        </template>
      </v-col>
      <v-col cols="8" style="flex-basis: 60%; max-width: 60%;" v-if="accountRequestData.tracks[track].fields[field] && !['mou', 'po'].includes(field)">
        <template v-if="accountRequestData.tracks[track].fields[field].display_component">
          <component
            v-if="
              [
                'harvard_key',
                'project',
                'scientific_area',
                'expense_code',
                'terms_and_conditions',
                'nnin_admin_username',
              ].includes(field)
            "
            :is="accountRequestData.tracks[track].fields[field].display_component"
            :data="accountRequestData[field]"
          ></component>
          <component
            v-else-if="['lab_info', 'entered_affiliation'].includes(field)"
            :is="accountRequestData.tracks[track].fields[field].display_component"
            v-model="localData"
            :organizations="organizations"
            @change="updateData()"
          ></component>
          <component
            v-else-if="['primary_affiliation'].includes(field)"
            :is="accountRequestData.tracks[track].fields[field].display_component"
            :data="accountRequestData"
          ></component>
          <component
            v-else-if="['demographic_data'].includes(field)"
            :is="accountRequestData.tracks[track].fields[field].display_component"
            :data="accountRequestData.person"
          ></component>
          <component
            v-else
            :is="accountRequestData.tracks[track].fields[field].display_component"
            :data="accountRequestData.person[field]"
          ></component>
        </template>
        <template v-else>
          {{ accountRequestData.person[field] }}
        </template>
      </v-col>
    </v-row>
  </v-container>
</template>
<style scoped>
.field-label {
  font-weight: bold;
  padding-top: 0px !important;
}
</style>
