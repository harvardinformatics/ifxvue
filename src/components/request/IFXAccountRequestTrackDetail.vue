<script>
// Display data common to all account requests
import DisplayAddressList from './IFXDisplayAddressList'
import DisplayContactList from './IFXDisplayContactList'
import DisplayHarvardKey from './IFXDisplayHarvardKey'
import DisplayDemographicData from './IFXDisplayDemographicData'
import DisplayMOU from './IFXDisplayMOU'
import DisplayProject from './IFXDisplayProject'

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
    DisplayProject,
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
              v-if="['harvard_key', 'project'].includes(field)"
              :is="accountRequestData.tracks[track].fields[field].display_component"
              :data="accountRequestData[field]"
            ></component>
            <component
              v-if="field == 'mou'"
              :is="accountRequestData.tracks[track].fields[field].display_component"
              :data="accountRequestData['request_files']"
            ></component>
            <component
              v-else-if="field == 'demographic_data'"
              :is="accountRequestData.tracks[track].fields[field].display_component"
              :data="accountRequestData.person"
            ></component>
            <component
              v-else
              :is="accountRequestData.tracks[track].fields[field].display_component"
              :data="accountRequestData.person[field]"
            ></component>
          </v-flex>
          <v-flex xs12 md9 v-else>
            <span v-if="accountRequestData.person[field]">{{ accountRequestData.person[field] }}</span>
            <span v-else>{{ accountRequestData[field] }}</span>
          </v-flex>
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
