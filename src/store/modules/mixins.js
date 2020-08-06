const ifxmixins = {
  methods: {
    sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms))
    }
  },
  computed: {
    /**
     * Gets first param from route
     * @returns {string}
     */
    firstRouteParam() {
      return this.$route.params[Object.keys(this.rt.params)[0]]
    },
    /**
     * If there is a route param, then the user is trying to edit a dewar request
     * Otherwise, user is trying to create a dewar request
     * @returns {boolean}
     */
    isEditing() {
      return this.firstRouteParam ? true : false
    },
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
        generic: [v => !!v || "Required field"],
        currency: [
          v => !!v || "Required field",
          v => (parseFloat(v) * 100) !== 0 || "Value cannot be 0"
        ]
      }
    },
    routeDelay() {
      return 2000
    }
  }
}

export default ifxmixins