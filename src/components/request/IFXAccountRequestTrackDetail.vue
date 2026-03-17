<script>
// Display data common to all account requests
import DisplayAddressList from './IFXDisplayAddressList'
import DisplayContactList from './IFXDisplayContactList'
import DisplayHarvardKey from './IFXDisplayHarvardKey'

export default {
  name: 'IFXAccountRequestTrackDetail',
  props: {
    accountRequestData: Object,
    track: String,
    trackTitle: String
  },
  components: {
    DisplayAddressList,
    DisplayContactList,
    DisplayHarvardKey
  },
  data() {
    return {}
  }
}
</script>
<template>
  <v-container  v-if="accountRequestData" >
    <v-row class="flex-column">
      <v-col cols="12">
        <span class="text-body-1 font-weight-bold">{{trackTitle}}</span>
      </v-col>
      <v-col cols="12" class="py-1" v-for="field in accountRequestData.tracks[track].fields.order" :key="field">
        <v-row dense wrap v-if="accountRequestData.tracks[track].fields[field]" justify-start>
          <v-col class="field-label" cols="12" md="3" v-if="accountRequestData.tracks[track].fields[field].display_name">
            {{accountRequestData.tracks[track].fields[field].display_name}}
          </v-col>
          <v-col class="field-label" cols="12" md="3" v-else>
            {{field}}
          </v-col>
          <v-col cols="12" v-if="accountRequestData.tracks[track].fields[field].display_component">
            <component v-if="field == 'harvard_key'"
              :is="accountRequestData.tracks[track].fields[field].display_component"
              :data="accountRequestData[field]">
            </component>
            <component v-else
              :is="accountRequestData.tracks[track].fields[field].display_component"
              :data="accountRequestData.person[field]">
            </component>
          </v-col>
          <v-col cols="12" v-else>
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
