const requiredFieldString = 'Required field'

const ifxmixins = {
  methods: {
    sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms))
    },
    areValuesDifferent(a, b) {
      if (a && b) {
        return JSON.parse(JSON.stringify(a)) !== JSON.parse(JSON.stringify(b))
      }
      return a !== b
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
        generic: [v => {
          // If input is array, check if empty
          if (Array.isArray(v)) {
            return !!v.length || requiredFieldString
          }
          // Check if input is falsey
          return !!v || requiredFieldString
        }],
        currency: [
          v => !!v || requiredFieldString,
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
