<script>
import { mapActions } from 'vuex'
import AccountRequestTrackDetail from './AccountRequestTrackDetail'
import AccountRequestStateList from './AccountRequestStateList'
import DisplayOnboardStep from './DisplayOnboardStep'
import RequestCommentList from './RequestCommentList'
import moment from 'moment'
import { forEach } from 'lodash'

/*
appTracks property should be a map of track names to display names, e.g.

const appTracks = {
  'general': 'General Information',
  'rc_approver': 'RC Approver'
}
*/

export default {
  name: 'AccountRequestDetail',
  props: {
    'auth': Object,
    'djangoAdminRootUrl': String,
    'requestApi': Object,
    'appTracks': Object
  },
  components: {
    AccountRequestTrackDetail,
    AccountRequestStateList,
    RequestCommentList,
    DisplayOnboardStep
  },
  data () {
    return {
      request: null,
      approval: null,
      valid_states: [],
      refresh_timer: null,
      updating_expiration_date: false,
      expiration_date_menu: false
    }
  },
  methods: {
    ...mapActions([
      'showMessage'
    ]),
    addEmptyComment () {
      // Adds an empty comment to the requestComments list.
      if (this.refresh_timer) {
        clearInterval(this.refresh_timer)
      }
      this.request.requestComments.unshift(this.requestApi.getEmptyRequestComment())
    },
    handleStepChange (step) {
      // If a step has been made incomplete, make sure that the request data confirmed step
      // is also incomplete so that the data will get updated.
      if (this.refresh_timer) {
        clearInterval(this.refresh_timer)
      }
      if (step && step.value === 'incomplete') {
        if (step.track !== 'general' && step.track in appTracks) {
          this.request.setTrackStepIncomplete(step.track, 'final_approval')
        }
      }
    },
    isAppTrack (track) {
      return track in appTracks
    },
    getTrackDisplayName (track) {
      return appTracks[track]
    },
    isDjangoStaff () {
      return this.auth.isDjangoStaff()
    },
    canBeApproved () {
      return this.requestApi.canBeApproved(this.request)
    },
    requestExpired () {
      return moment(this.request.continuationKeyExpiration).isBefore(moment())
    },
    updatingExpirationDate () {
      this.updating_expiration_date = true
      clearInterval(this.refresh_timer)
    },
    async updateRequestComment (commentData) {
      if (commentData.text) {
        this.request.requestComments[commentData.index] = {
          text: commentData.text,
          request: this.request.id
        }
      }
      this.updateRequest(false)
        .then(() => {
          this.getRequest(this.$route.params.id)
        })
    },
    async updateRequest (notify) {
      this.updating_expiration_date = false
      if (notify) {
        this.request.onBoardRequest.notifyRequestorOfUpdates = true
      }
      let me = this
      await this.requestApi.updateAccountRequest(this.request)
        .then((response) => {
          let message = 'Account request updated'
          me.showMessage({ message })
        })
        .catch((error) => {
          me.showMessage(error)
        })
    },
    updateRequestState () {
      if (this.approval) {
        if (this.refresh_timer) {
          clearInterval(this.refresh_timer)
        }
        let me = this
        let newState = this.request.currentState
        if (this.approval === 'approve' && this.request.currentState.includes('APPROVAL_PENDING')) {
          newState = this.request.currentState.replace('APPROVAL_PENDING', 'APPROVED')
        } else if (this.approval === 'reject') {
          newState = 'REJECTED'
        } else {
          console.log('this is weird')
        }
        this.requestApi.setState(this.request.id, newState)
          .then((response) => {
            me.$router.go()
          })
          .catch((error) => {
            me.showMessage(error)
          })
      }
    },
    // getEmailList (data) {
    //   let emails = []
    //   if (data.contacts) {
    //     forEach(data.contacts, function(contact){
    //       if (contact.details && contact.type.toLowerCase().includes('email')) {
    //         if (data.primary_email && data.primary_email === contact.details) {
    //           emails.push(contact.details + ' (primary)')
    //         } else {
    //           emails.push(contact.details)
    //         }
    //       }
    //     })
    //   }
    //   return emails.join(', ')
    // },
    getRequest (id) {
      // Return account request by id
      let me = this
      this.requestApi.getRequest(id)
        .then((response) => {
          me.request = response
          if (me.request.result) {
            clearInterval(me.refresh_timer)
          }
          me.requestApi.getValidProcessorStates(me.request.processor)
            .then((response) => {
              forEach(response.data, function (state) {
                let display = me.$options.filters.stateDisplay(state)
                me.valid_states.push({ 'display': display, 'value': state })
              })
            })
            .catch((error) => {
              this.showMessage(error)
            })
        })
        .catch((error) => {
          console.log(error)
          this.showMessage(error)
        })
    }
  },
  computed: {
    django_admin_url: function () {
      return [this.djangoAdminRootUrl, 'ifxrequest', 'request', this.request.id, 'change/'].join('/')
    }
  },
  beforeRouteLeave (to, from, next) {
    clearInterval(this.timer)
    next()
  },
  mounted () {
    let me = this
    this.getRequest(me.$route.params.id)
    this.refresh_timer = null
    this.refresh_timer = setInterval(function () {
      if (me.$route.params.id) {
        me.getRequest(me.$route.params.id)
      }
    }, 4000)
  }
}
</script>
<template>
  <v-container grid-list-md>
    <v-layout row>
      <v-flex xs12>
        <v-card v-if="request">
          <v-card-title>
            <v-layout row wrap justify-start align-center>
              <v-flex>
                <span class="headline">Account request from {{request.fullName}}</span>
              </v-flex>
              <v-flex>
                <span v-if="request.result == 'SUCCESS'"><v-icon color="success">thumb_up</v-icon>&nbsp;Success</span>
                <span v-else-if="request.result == 'FAILED'"><v-icon color="error">error_outline</v-icon>&nbsp;Failed</span>
                <span v-else-if="request.result == 'REJECTED'"><v-icon color="error">thumb_down</v-icon>&nbsp;Rejected</span>
                <span v-else><v-icon color="grey">cached</v-icon>&nbsp;{{request.currentState | stateDisplay}}</span>
              </v-flex>
              <v-flex shrink>
                <v-tooltip top>
                  <template slot="activator">
                    <v-btn fab small
                      class="item-add"
                      color="green"
                      @click="addEmptyComment()"
                    >
                      <v-icon dark >playlist_add</v-icon>
                    </v-btn>
                  </template>
                  <span>Add comment to request</span>
                </v-tooltip>
              </v-flex>
              <v-flex shrink>
                <v-tooltip top>
                  <template slot="activator">
                    <v-btn fab small color="info" v-show="isDjangoStaff()" :href="django_admin_url">
                      <v-icon color="yellow">vpn_key</v-icon>
                    </v-btn>
                  </template>
                  <span>View request Django admin form</span>
                </v-tooltip>
              </v-flex>
            </v-layout>
          </v-card-title>
          <v-container>
            <v-layout row wrap>
              <v-flex xs12 v-if="request.requestComments.length > 0">
                <RequestCommentList :request="request" @update="updateRequestComment"/>
              </v-flex>
              <v-flex xs6>
                <v-layout row wrap justify-start align-center>
                  <v-flex shrink  class="expiration-date-label">
                    Onboard request
                    <span v-if="requestExpired()">expired</span>
                    <span v-else>expires</span>
                  </v-flex>
                  <v-flex v-if="updating_expiration_date" shrink>
                    <v-menu
                      v-model="expiration_date_menu"
                      :close-on-content-click="false"
                      full-width
                    >
                      <template v-slot:activator="{ on }">
                        <v-text-field
                          :value="request.continuationKeyExpiration"
                          v-on="on"
                          readonly
                        >
                        </v-text-field>
                      </template>
                      <v-date-picker
                        v-model="request.continuationKeyExpiration"
                        reactive
                        no-title
                        scrollable
                        @change="updateRequest()"
                      >
                     </v-date-picker>
                    </v-menu>
                  </v-flex>
                  <v-flex v-else shrink>
                    {{request.continuationKeyExpiration}}
                  </v-flex>
                  <v-flex>
                    <v-btn :disabled="updating_expiration_date" fab small color="info" @click="updatingExpirationDate()">
                      <v-icon>calendar_today</v-icon>
                    </v-btn>
                  </v-flex>

                </v-layout>
              </v-flex>
              <v-flex xs6 v-if="canBeApproved()">
                <v-layout row justify-end>
                  <v-flex grow>
                    &nbsp;
                  </v-flex>
                  <v-flex shrink>
                    <v-radio-group :column="false" v-model="approval" @change="updateRequestState()">
                      <v-radio label="Approve" value="approve"></v-radio>
                      <v-radio label="Reject" value="reject"></v-radio>
                    </v-radio-group>
                  </v-flex>
                </v-layout>
              </v-flex>
              <v-flex xs7>
                <v-layout column>
                  <v-flex v-for="track in request.tracks.order" :key="track">
                    <AccountRequestTrackDetail v-if="request && isAppTrack(track)" :track="track" :trackTitle="getTrackDisplayName(track)" :accountRequestData="request.onBoardRequest.data"/>
                  </v-flex>
                </v-layout>
              </v-flex>
              <v-flex grow>
                <v-container>
                  <v-layout column>
                    <v-flex>
                      <span class="title">Onboarding Steps</span>
                    </v-flex>
                    <v-flex v-for="track in request.tracks.order" :key="track">
                      <v-layout column>
                        <v-flex v-for="step in request.tracks[track].order" :key="step">
                          <DisplayOnboardStep v-if="step !== 'completed_request'" @update="handleStepChange" :step="request.tracks[track][step]" :stepName="step" :trackName="track"/>
                        </v-flex>
                      </v-layout>
                    </v-flex>
                    <v-flex justify-center>
                      <div class="text-xs-center">
                        <v-btn
                          color="primary"
                          @click="updateRequest('notify')"
                        >Update Steps
                        </v-btn>
                      </div>
                    </v-flex>
                  </v-layout>
                </v-container>
              </v-flex>
            </v-layout>
            <v-layout column>
              <v-flex v-if="request">
                <AccountRequestStateList :request="request" :validStates="valid_states"/>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<style scoped>
  .expiration-date-label {
    font-size: 18px;
    color: rgba(0,0,0,0.87);
  }
</style>
