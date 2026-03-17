<script>
import moment from 'moment'
import forEach from 'lodash/forEach'
import { mapActions } from 'vuex'
import IFXAccountRequestTrackDetail from './IFXAccountRequestTrackDetail'
import IFXAccountRequestStateList from './IFXAccountRequestStateList'
import IFXDisplayOnboardStep from './IFXDisplayOnboardStep'
import IFXRequestCommentList from './IFXRequestCommentList'
import IFXAccountRequestFile from './IFXAccountRequestFile'

/* Tracks prop should be of the form:

    tracks: {
      general: 'General Information',
      rc_approver: 'RC Approver'
    }
*/

export default {
  name: 'IFXAccountRequestDetail',
  components: {
    IFXAccountRequestTrackDetail,
    IFXAccountRequestStateList,
    IFXRequestCommentList,
    IFXAccountRequestFile,
    IFXDisplayOnboardStep,
  },
  props: {
    tracks: Object,
  },
  data() {
    return {
      request: null,
      approval: null,
      valid_states: [],
      refresh_timer: null,
      updating_expiration_date: false,
      expiration_date_menu: false,
      organizations: [], // Needed for IFXAccountRequestTrackDetail and IFXDisplayLabInfo
      loading: true,
    }
  },
  methods: {
    ...mapActions(['showMessage']),
    addEmptyComment() {
      // Adds an empty comment to the requestComments list.
      if (this.refresh_timer) {
        clearInterval(this.refresh_timer)
      }
      this.request.requestComments.unshift(this.$requestApi.newRequestComment())
    },
    handleStepChange(step) {
      // If a step has been made incomplete, make sure that the request data confirmed step
      // is also incomplete so that the data will get updated.
      if (this.refresh_timer) {
        clearInterval(this.refresh_timer)
      }
      if (step && step.value === 'incomplete') {
        if (step.track !== 'general' && this.tracks.hasOwnProperty(step.track)) {
          this.request.setTrackStepIncomplete(step.track, 'final_approval')
        }
      }
    },
    isAppTrack(track) {
      return this.tracks.hasOwnProperty(track)
    },
    getTrackDisplayName(track) {
      return this.tracks[track]
    },
    isDjangoStaff() {
      return this.$api.isDjangoStaff
    },
    canBeApproved() {
      return this.$requestApi.canBeApproved(this.request)
    },
    requestExpired() {
      return moment(this.request.continuationKeyExpiration).isBefore(moment())
    },
    updatingExpirationDate() {
      this.updating_expiration_date = true
      clearInterval(this.refresh_timer)
    },
    async updateRequestComment(commentData) {
      if (commentData.text) {
        this.request.requestComments[commentData.index] = {
          text: commentData.text,
          request: this.request.id,
        }
      }
      this.updateRequest(false).then(() => {
        this.getRequest(this.$route.params.id)
      })
    },
    async updateRequest(notify) {
      this.updating_expiration_date = false
      if (notify) {
        this.request.onBoardRequest.notifyRequestorOfUpdates = true
      }
      const me = this
      await this.$requestApi
        .updateAccountRequest(this.request)
        .then(() => {
          const message = 'Account request updated'
          me.showMessage({ message })
        })
        .catch((error) => {
          me.showMessage(error)
        })
    },
    updateRequestState() {
      if (this.approval) {
        if (this.refresh_timer) {
          clearInterval(this.refresh_timer)
        }
        const me = this
        let newState = this.request.currentState
        if (this.approval === 'approve' && this.request.currentState.includes('APPROVAL_PENDING')) {
          newState = this.request.currentState.replace('APPROVAL_PENDING', 'APPROVED')
        } else if (this.approval === 'reject') {
          newState = 'REJECTED'
        } else {
          console.log('this is weird')
        }
        this.$requestApi
          .setState(this.request.id, newState)
          .then(() => {
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
    getRequest(id) {
      // Return account request by id
      const me = this
      this.$requestApi
        .getRequest(id)
        .then((response) => {
          me.request = response
          if (me.request.result) {
            clearInterval(me.refresh_timer)
          }
          this.$requestApi
            .getValidProcessorStates(me.request.processor)
            .then((res) => {
              forEach(res.data, (state) => {
                const display = me.$stateDisplay(state)
                me.valid_states.push({ display: display, value: state })
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
    },
  },
  computed: {
    django_admin_url: function () {
      return `${this.$api.urls.DJANGO_ADMIN_ROOT}ifxrequest/request/${this.request.id}/change/`
    },
  },
  beforeRouteLeave(to, from, next) {
    clearInterval(this.refresh_timer)
    next()
  },
  async mounted() {
    const me = this
    await this.getRequest(me.$route.params.id)
    this.organizations = await this.$api.organization.getNames()
    this.loading = false
    this.refresh_timer = null
    this.refresh_timer = setInterval(() => {
      if (me.$route.params.id) {
        me.getRequest(me.$route.params.id)
      }
    }, 4000)
  },
}
</script>
<template>
  <v-container grid-list-md v-if="!loading">
    <v-row>
      <v-col xs12>
        <v-card v-if="request" flat>
          <v-card-title>
            <v-row wrap justify-start align-center>
              <v-col>
                <span class="headline">Account request from {{ request.fullName }}</span>
              </v-col>
              <v-col>
                <span v-if="request.result == 'SUCCESS'">
                  <v-icon color="success">thumb_up</v-icon>
                  &nbsp;Success
                </span>
                <span v-else-if="request.result == 'FAILED'">
                  <v-icon color="error">error_outline</v-icon>
                  &nbsp;Failed
                </span>
                <span v-else-if="request.result == 'REJECTED'">
                  <v-icon color="error">thumb_down</v-icon>
                  &nbsp;Rejected
                </span>
                <span v-else>
                  <v-icon color="grey">cached</v-icon>
                  &nbsp;{{ $stateDisplay(request.currentState) }}
                </span>
              </v-col>
              <v-col shrink>
                <v-tooltip location="top">
                  <template v-slot:activator="{ on }">
                    <v-btn v-on="on" fab size="small" class="item-add" color="green" @click="addEmptyComment()">
                      <v-icon dark>playlist_add</v-icon>
                    </v-btn>
                  </template>
                  <span>Add comment to request</span>
                </v-tooltip>
              </v-col>
              <v-col shrink>
                <v-tooltip location="top">
                  <template v-slot:activator="{ on }">
                    <v-btn v-on="on" fab size="small" color="info" v-show="isDjangoStaff()" :href="django_admin_url">
                      <v-icon color="yellow">vpn_key</v-icon>
                    </v-btn>
                  </template>
                  <span>View request Django admin form</span>
                </v-tooltip>
              </v-col>
            </v-row>
          </v-card-title>
          <v-container>
            <v-row wrap>
              <v-col xs12 v-if="request.requestComments.length > 0">
                <IFXRequestCommentList :request="request" @update="updateRequestComment" />
              </v-col>
              <v-col xs6>
                <v-row wrap justify-start align-center>
                  <v-col shrink class="expiration-date-label">
                    Onboard request
                    <span v-if="requestExpired()">expired</span>
                    <span v-else>expires</span>
                  </v-col>
                  <v-col v-if="updating_expiration_date" shrink>
                    <v-menu v-model="expiration_date_menu" :close-on-content-click="false" full-width>
                      <template v-slot:activator="{ on }">
                        <v-text-field :value="request.continuationKeyExpiration" v-on="on" readonly></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="request.continuationKeyExpiration"
                        reactive
                        no-title
                        scrollable
                        @change="updateRequest()"
                      ></v-date-picker>
                    </v-menu>
                  </v-col>
                  <v-col v-else shrink>
                    {{ request.continuationKeyExpiration }}
                  </v-col>
                  <v-col>
                    <v-btn
                      :disabled="updating_expiration_date"
                      fab
                      size="small"
                      color="info"
                      @click="updatingExpirationDate()"
                    >
                      <v-icon>calendar_today</v-icon>
                    </v-btn>
                  </v-col>
                </v-row>
              </v-col>
              <v-col xs6 v-if="canBeApproved()">
                <v-row justify-end>
                  <v-col grow>&nbsp;</v-col>
                  <v-col shrink>
                    <v-radio-group :column="false" v-model="approval" @change="updateRequestState()">
                      <v-radio label="Approve" value="approve"></v-radio>
                      <v-radio label="Reject" value="reject"></v-radio>
                    </v-radio-group>
                  </v-col>
                </v-row>
              </v-col>
              <v-col xs7>
                <v-row column>
                  <v-col v-for="track in request.tracks.order" :key="track">
                    <IFXAccountRequestTrackDetail
                      v-if="request && isAppTrack(track)"
                      :track="track"
                      :trackTitle="getTrackDisplayName(track)"
                      :accountRequestData="request.onBoardRequest.data"
                      :accountRequest="request"
                      :organizations="organizations"
                    />
                  </v-col>
                </v-row>
                <v-row column>
                  <v-col>
                    <span class="title">Request Files</span>
                  </v-col>
                  <v-col
                    v-for="accountRequestFileData in request.requestData.request_files"
                    :key="accountRequestFileData.id"
                  >
                    <IFXAccountRequestFile :accountRequestFileData="accountRequestFileData" />
                  </v-col>
                </v-row>
              </v-col>
              <v-col grow>
                <v-container>
                  <v-row column>
                    <v-col>
                      <span class="title">Onboarding Steps</span>
                    </v-col>
                    <v-col v-for="track in request.tracks.order" :key="track">
                      <v-row v-if="isAppTrack(track)" column>
                        <v-col v-for="step in request.tracks[track].order" :key="step">
                          <IFXDisplayOnboardStep
                            v-if="step !== 'completed_request'"
                            @update="handleStepChange"
                            :step="request.tracks[track][step]"
                            :stepName="step"
                            :trackName="track"
                          />
                        </v-col>
                      </v-row>
                    </v-col>
                    <v-col justify-center>
                      <div class="text-xs-center">
                        <v-btn color="primary" @click="updateRequest('notify')">Update Steps</v-btn>
                      </div>
                    </v-col>
                  </v-row>
                </v-container>
              </v-col>
            </v-row>
            <v-row column>
              <v-col v-if="request">
                <IFXAccountRequestStateList :request="request" :validStates="valid_states" />
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<style scoped>
.expiration-date-label {
  font-size: 18px;
  color: rgba(0, 0, 0, 0.87);
}
</style>
