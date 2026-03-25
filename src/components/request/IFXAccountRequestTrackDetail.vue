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
      labInfoKey: 0,
      poDataKey: 0,
      mouDataKey: 0,
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
  methods: {
    handleChange(){
      this.$emit('change', this.accountRequestData)
    }
  },
  mounted() {
    this.labInfoKey += 1
    this.poDataKey += 1
    this.mouDataKey += 1
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
            <DisplayHarvardKey v-if="field == 'harvard_key'"
              :data="accountRequestData[field]">
            </DisplayHarvardKey>
            <DisplayLabInfo v-else-if="field == 'lab_info'"
              :value="accountRequestData[field]"
              :organizations="organizations"
              :key="labInfoKey"
              @change="handleChange()"
            >
            </DisplayLabInfo>
            <DisplayScientificArea v-else-if="field == 'scientific_area'"
              :data="accountRequestData[field]"
            >
            </DisplayScientificArea>
            <DisplayExpenseCode v-else-if="field == 'expense_code'"
              :data="accountRequestData[field]"
            >
            </DisplayExpenseCode>
            <DisplayTermsAndConditions v-else-if="field == 'terms_and_conditions'"
              :data="accountRequestData[field]"
            >
            </DisplayTermsAndConditions>
            <DisplayProject v-else-if="field == 'project'"
              :data="accountRequestData[field]"
            >
            </DisplayProject>
            <DisplayDemographicData v-else-if="field == 'demographic_data'"
              :data="accountRequestData['person']"
            >
            </DisplayDemographicData>
            <component v-else
              :is="accountRequestData.tracks[track].fields[field].display_component"
              :data="accountRequestData.person[field]">
            </component>
          </v-col>
          <v-col cols="10" v-else-if="field == 'po'">
            <DisplayPO
              :data="accountRequestData.request_files"
              :key="poDataKey"
            >
            </DisplayPO>
          </v-col>
          <v-col cols="10" v-else-if="field == 'mou'">
            <DisplayMOU
              :data="accountRequestData.request_files"
              :key="mouDataKey"
            >
            </DisplayMOU>
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
