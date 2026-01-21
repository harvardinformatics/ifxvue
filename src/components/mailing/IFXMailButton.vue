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
      default: 'top',
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
            key="to"
            size="small"
            color="#A4F323"
            class="mail-btn-circular"
            @click="setRecipientField('to')"
          >
            to:
          </v-btn>
          <v-btn
            key="cc"
            size="small"
            color="#86C61D"
            class="mail-btn-circular"
            @click="setRecipientField('cc')"
          >
            cc:
          </v-btn>
          <v-btn
            key="bcc"
            size="small"
            color="#669617"
            class="mail-btn-circular"
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

<style scoped>
.mail-btn-circular {
  width: 36px;
  height: 36px;
  border-radius: 50% !important;
  min-width: 36px;
  padding: 0 !important;
  font-size: 0.7rem;
}
</style>