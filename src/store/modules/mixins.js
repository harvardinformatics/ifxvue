import moment from 'moment'

const requiredFieldString = 'Required field'
const baseRule = (v) => !!v || requiredFieldString

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
    },
    getFirstBusinessDay(now) {
      const hour = now.hour()
      const todayInt = now.isoWeekday()

      // If today is Friday and it is 11am or later, first business day is next monday
      if (todayInt === 5 && hour >= 11) {
        // Add one week to today and get monday of that week
        return now
          .clone()
          .add(1, 'week')
          .isoWeekday(1)
      }
      if ([6, 7].includes(todayInt)) {
        // If today is Saturday or Sunday, first business day is next monday
        return now
          .clone()
          .add(1, 'week')
          .isoWeekday(1)
      }
      // If it is a weekday and it is before 11am, today is the first business day
      if (hour < 11) {
        return now.clone()
      }
      // If it is 11am or later on a weekday, add one day to make tomorrow the first business day
      return now.clone().add(1, 'day')
    },
    getDeliveryDay(firstBusinessDay) {
      // If firstBusinessDay is Monday, Tuesday, or Wednesday, deliver two days later
      if ([1, 2, 3].includes(firstBusinessDay.isoWeekday())) {
        return firstBusinessDay.clone().add(2, 'days')
      }
      // If firstBusinessDay is Thursday, deliver next Monday
      if (firstBusinessDay.isoWeekday() === 4) {
        return firstBusinessDay
          .clone()
          .add(1, 'week')
          .isoWeekday(1)
      }
      // If firstBusinessDay is Friday, deliver next Tuesday
      if (firstBusinessDay.isoWeekday() === 5) {
        return firstBusinessDay
          .clone()
          .add(1, 'week')
          .isoWeekday(2)
      }
      return null
    },
    minDate() {
      // Administrators have no minimum date
      if (this.isAdmin) return null
      // Standard users can reserve two business days in advance
      // Today is considered a business day if before 11am
      const now = moment()
      const firstBusinessDay = this.getFirstBusinessDay(now)
      const deliveryDay = this.getDeliveryDay(firstBusinessDay)
      if (!deliveryDay) {
        return now
      }
      return deliveryDay.toISOString()
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
        email: [
          baseRule,
          v => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v)
            || 'E-mail must be valid'
        ],
        currency: [
          baseRule,
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
