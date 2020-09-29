const ifxmixins = {
  methods: {
    sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms))
    }
  },
  computed: {
    rtr() {
      return this.$router
    },
    rt() {
      return this.$route
    },
    /**
     * Collection of rules for v-form fields.
     * @returns {object}
     */
    formRules() {
      return {
        generic: [v => !!v || 'Required field'],
        currency: [
          v => !!v || 'Required field',
          v => (parseFloat(v) * 100) !== 0 || 'Value cannot be 0'
        ]
      }
    },
    routeDelay() {
      return 2000
    }
  }
}

export default ifxmixins
