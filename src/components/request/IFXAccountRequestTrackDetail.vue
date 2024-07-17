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
  },
  data() {
    return {
      localData: this.accountRequestData,
      localAccountRequest: this.accountRequest,
    }
  },
  watch: {
    localData: {
      handler() {
        console.log('watch accountRequestData in AccountRequestTrackDetail.vue', this.localAccountRequest)
      },
      deep: true,
    },
  },
  methods: {
    updateData() {
      console.log('updateData in AccountRequestTrackDetail.vue', this.localAccountRequest)
      if (this.localAccountRequest.onBoardRequest) {
        this.localAccountRequest.onBoardRequest.data = this.localData
        this.$requestApi.updateAccountRequest(this.localAccountRequest)
        console.log('updated the data in AccountRequestTrackDetail.vue', this.localAccountRequest)
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
              v-if="['harvard_key', 'project'].includes(field)"
              :is="accountRequestData.tracks[track].fields[field].display_component"
              :data="accountRequestData[field]"
            ></component>
            <component
              v-if="field == 'lab_info'"
              :is="accountRequestData.tracks[track].fields[field].display_component"
              v-model="localData"
              :organizations="organizations"
              @change="updateData()"
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
