import moment from 'moment'

const requiredFieldString = 'Required field'
const baseRule = (v) => {
  // Allow 0
  if (Number.parseFloat(v) === 0) return true
  return !!v || requiredFieldString
}
const numericRule = (v) => !Number.isNaN(v) || 'Value must be numeric'
const nonZeroRule = (v) => parseFloat(v) !== 0 || 'Value cannot be zero'

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
    },
    truncateString(string, length = 120) {
      if (string.length <= length) {
        return string
      }
      return `${string.substring(0, length)}...`
    },
    formatOrganizationParents(parents) {
      return parents.join(', ') || 'None'
    },
    formatOrganizationRank(rank) {
      return this.$api.organization.getValidRankByValue(rank).text
    },
    lowerCaseFirstChar(string) {
      return string.charAt(0).toLowerCase() + string.slice(1)
    },
    getGroupsString(item) {
      const groups = item.groups.join(', ')
      return groups || 'None'
    },
    navigateToEdit(type, id) {
      this.rtr.push({ name: `${type}Edit`, params: { id } })
    },
    navigateToDetail(type, id) {
      this.rtr.push({ name: `${type}Detail`, params: { id } })
    },
    navigateToCreate(type) {
      this.rtr.push({ name: `${type}Create` })
    },
    getFormattedActive(activeBool) {
      return activeBool ? 'Active' : 'Inactive'
    }
  },
  computed: {
    rtr() {
      return this.$router
    },
    rt() {
      return this.$route
    },
    defaultItemsPerPage() {
      return 10
    },
    defaultItemsPerPageOptions() {
      return [10, 20, { text: 'All', value: -1 }]
    },
    /**
     * Collection of rules for v-form fields.
     * @returns {object}
     */
    formRules() {
      return {
        generic: [v => {
          // If input is object, like an autocomplete, check if empty
          if (typeof v === 'object' && v !== null) {
            return !!Object.keys(v).length || requiredFieldString
          }
          // If input is array, check if empty
          if (Array.isArray(v)) {
            return !!v.length || requiredFieldString
          }
          // Check if input is falsey
          return baseRule(v)
        }],
        positiveNumber: [
          baseRule,
          numericRule,
          nonZeroRule
        ],
        email: [
          baseRule,
          v => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v)
            || 'E-mail must be valid'
        ],
        currency: [
          baseRule,
          v => (parseFloat(v) * 100) !== 0 || 'Value cannot be 0'
        ],
        contactable: [
          baseRule,
          v => (!!v.firstName && !!v.lastName) || requiredFieldString
        ]
      }
    },
    routeDelay() {
      return 2000
    }
  }
}

export default ifxmixins
