<script>
// Assumes a Contact record that is tied to a person and has a name
export default {
  name: 'IFXContactCard',
  props: {
    contact: {
      type: Object,
      required: false,
      default: () => null,
    },
    dense: {
      type: Boolean,
      required: false,
      default: () => false,
    },
    editBtn: {
      type: Boolean,
      required: false,
      default: true,
    },
  },
  methods: {
    canEdit() {
      return this.$api.auth.can('edit-contact', this.$api.authUser)
    },
  },
  computed: {
    cardClass() {
      return {
        'contact-card': true,
        dense: this.dense,
      }
    },
    contactData() {
      return this.contact || {}
    },
    contactID() {
      return this.contactData.id || ''
    },
  },
}
</script>
<template>
  <v-card :class="cardClass">
    <span v-if="contact">
      <IFXButton
        class="contact-edit-btn"
        v-if="editBtn"
        btnType="edit"
        x-small
        @action="() => this.navigateToEdit('Contact', contactID.toString())"
      />

      <!-- Titles -->
      <v-card-title xs-12 v-if="contactData.org">
        <!-- So that contacts on the OrganizationDetail page don't see blank space -->
        <v-col alignContent="start" justify="start">
          <v-row>
            <div class="headline mr-8">{{ contactData.org }} ({{ contactData.name }})</div>
          </v-row>
        </v-col>
      </v-card-title>

      <v-card-title xs-12 v-else-if="contactData.name">
        <v-col>
          <v-row>
            <div class="headline mr-8">
              <router-link v-if="contactData.userId" :to="{ name: 'UserEdit', params: { id: contactData.userId } }">
                {{ contactData.name }}
              </router-link>
              <div v-else>{{ contactData.name }}</div>
            </div>
          </v-row>
        </v-col>
      </v-card-title>

      <!-- This should probably never render -->
      <v-card-title v-else>
        <div class="headline">Contact Details</div>
      </v-card-title>

      <!-- Body -->
      <v-card-text>
        <v-row v-if="contactData.detail" dense justify="start" align="center">
          <v-col cols="1">
            <v-icon color="success">email</v-icon>
          </v-col>
          <v-col>
            <a :href="`mailto:${contactData.detail}`">{{ contactData.detail }}</a>
          </v-col>
        </v-row>
        <v-row v-if="contactData.phone" dense justify="start" align="center">
          <v-col cols="1">
            <v-icon color="success">local_phone</v-icon>
          </v-col>
          <v-col>
            {{ contactData.phone }}
          </v-col>
        </v-row>
        <v-row v-if="contactData.address" dense justify="start" align="center">
          <v-col cols="1">
            <v-icon color="success">place</v-icon>
          </v-col>
          <v-col class="contact-address">
            {{ contactData.address }}
          </v-col>
        </v-row>
      </v-card-text>
    </span>
    <span v-else>
      <div class="empty-contact"></div>
    </span>
  </v-card>
</template>
<style scoped>
.contact-card {
  padding: 0.2rem;
  padding-top: 0;
  width: 100%;
  margin: 1rem;
  height: 300px;
}

.dense {
  width: auto;
  height: auto;
}

.contact-edit-btn {
  position: absolute;
  right: 10px;
  top: 10px;
}

.empty-contact {
  background-color: #dedede;
  min-height: 300px;
}
</style>
