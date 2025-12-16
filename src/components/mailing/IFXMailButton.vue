<script>
export default {
  name: 'IFXMailButton',
  props: {
    modelValue: {
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
      this.$emit('update:modelValue', field)
    }
  }
}
</script>

<template>
  <v-tooltip location="top">
    <template v-slot:activator="{ props }">
      <div v-bind="props">
        <v-speed-dial
          :direction="direction"
          v-model="mailFab"
        >
          <template v-slot:activator="{ props: activatorProps }">
            <v-btn
              v-bind="activatorProps"
              v-model="mailFab"
              size="small"
              :color="color"
              icon
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
            size="x-small"
            icon
            color="#A4F323"
            @click="setRecipientField('to')"
          >
            to:
          </v-btn>
          <v-btn
            size="x-small"
            icon
            color="#86C61D"
            @click="setRecipientField('cc')"
          >
            cc:
          </v-btn>
          <v-btn
            size="x-small"
            icon
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