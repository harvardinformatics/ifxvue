<script>
// Speed dial control for sending items to to:, cc:, or bcc: fields on IFXMailingCompose
// v-model should be bound to the "selected" list.  Check for length of input determines enabled state

export default {
  name: 'IFXMailButton',
  props: {
    value: {
      type: String,
      required: true,
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false,
    },
    toolTip: {
      type: String,
      required: false,
      default: 'Compose message with selected',
    },
    direction: {
      type: String,
      required: false,
      default: 'bottom',
    },
    icon: {
      type: String,
      required: false,
      default: 'mdi-email-send-outline'
    },
    color: {
      type: String,
      required: false,
      default: 'green',
    }
  },
  data() {
    return {
      mailFab: false
    }
  },
  methods: {
    setRecipientField(field) {
      this.$emit('input', field)
    }
  }
}
</script>
<template>
  <v-tooltip top>
    <template v-slot:activator="{ on, attrs }">
      <div v-on="on">
        <v-speed-dial
          :direction="direction"
          v-model="mailFab"
          v-bind="attrs"
        >
          <template v-slot:activator>
            <v-btn
              v-model="mailFab"
              small
              :color="color"
              fab
              :disabled="disabled"
            >
              <v-icon color="white" v-if="mailFab">
                mdi-close
              </v-icon>
              <v-icon color="white" v-else>
                {{ icon }}
              </v-icon>
            </v-btn>
          </template>
          <v-btn
            xSmall
            fab
            color="#A4F323"
            @click="setRecipientField('to')"
          >
            to:
          </v-btn>
          <v-btn
            xSmall
            fab
            color="#86C61D"
            @click="setRecipientField('cc')"
          >
            cc:
          </v-btn>
          <v-btn
            xSmall
            fab
            color="#669617"
            @click="setRecipientField('bcc')"
          >
            bcc:
          </v-btn>
        </v-speed-dial>
      </div>
    </template>
    <span>
      {{ toolTip }}
    </span>
  </v-tooltip>
</template>
