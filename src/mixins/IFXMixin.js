// General mixin for ifxvue
// Includes helper methods and computed values used throughout the library

import moment from 'moment'

// Helper methods for use in form rules, not included in main mixin so they can be referenced by main mixin
const requiredFieldString = 'Required field'

/**
 * Checks if value exists and is not zero
 * @param {any} v
 * @returns {boolean | string}
 */
const baseRule = (v) => {
  // Allow 0
  if (Number.parseFloat(v) === 0) return true
  return !!v || requiredFieldString
}
/**
 * Checks if value is numeric
 * @param {any} v
 * @returns {boolean | string}
 */
const numericRule = (v) => !Number.isNaN(v) || 'Value must be numeric'

/**
 * Checks if value is not zero
 * @param {any} v
 * @returns {boolean | string}
 */
const nonZeroRule = (v) => parseFloat(v) !== 0 || 'Value cannot be zero'

/**
 * Checks if value is positive
 * @param {any} v
 * @returns {boolean | string}
 */
const positiveRule = (v) => parseFloat(v) > 0 || 'Value cannot be negative'

// Main mixin block
export default {
  methods: {
    /**
     * Simulates sleep in async functions
     * @param {number} ms milliseconds
     * @returns {Promise}
     */
    sleep(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms))
    },
    /**
     * Checks if two values are different
     * TODO: needs improvement, especially for complex, non-jsonifiable objects
     * @param {any} a valueA
     * @param {any} b valueB
     * @returns {boolean}
     */
    areValuesDifferent(a, b) {
      if (a && b) {
        return JSON.parse(JSON.stringify(a)) !== JSON.parse(JSON.stringify(b))
      }
      return a !== b
    },
    /**
     * Gets first business day from now date
     * Used primarily for Helium requests
     * @param {date} now
     * @returns {date} first business day from date
     */
    getFirstBusinessDay(now) {
      const hour = now.hour()
      const todayInt = now.isoWeekday()

      // If today is Friday and it is 11am or later, first business day is next monday
      if (todayInt === 5 && hour >= 11) {
        // Add one week to today and get monday of that week
        return now.clone().add(1, 'week').isoWeekday(1)
      }
      if ([6, 7].includes(todayInt)) {
        // If today is Saturday or Sunday, first business day is next monday
        return now.clone().add(1, 'week').isoWeekday(1)
      }
      // If it is a weekday and it is before 11am, today is the first business day
      if (hour < 11) {
        return now.clone()
      }
      // If it is 11am or later on a weekday, add one day to make tomorrow the first business day
      return now.clone().add(1, 'day')
    },
    /**
     * Gets first viable delivery day from date (usually first business day)
     * Used primarily for Helium requests
     * @param {date} firstBusinessDay
     * @returns {date} delivery day, based in firstBusinessDay
     */
    getDeliveryDay(firstBusinessDay) {
      // If firstBusinessDay is Monday, Tuesday, or Wednesday, deliver two days later
      if ([1, 2, 3].includes(firstBusinessDay.isoWeekday())) {
        return firstBusinessDay.clone().add(2, 'days')
      }
      // If firstBusinessDay is Thursday, deliver next Monday
      if (firstBusinessDay.isoWeekday() === 4) {
        return firstBusinessDay.clone().add(1, 'week').isoWeekday(1)
      }
      // If firstBusinessDay is Friday, deliver next Tuesday
      if (firstBusinessDay.isoWeekday() === 5) {
        return firstBusinessDay.clone().add(1, 'week').isoWeekday(2)
      }
      return null
    },
    /**
     * Gets the minimum date for certain requests to be completed
     * @returns {date} deliveryDay
     */
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
    /**
     * Truncates string based on length, adds ellipses to end
     * @param {string} string to truncate
     * @param {length} length of output string
     * @returns {date} deliveryDay
     */
    truncateString(string, length = 120) {
      if (!string || string.length <= length) {
        return string
      }
      return `${string.substring(0, length)}...`
    },
    /**
     * Formats parents array, usually from an organization
     * @param {array} parents of organzation
     * @returns {string} of joined parent strings
     */
    formatOrganizationParents(parents) {
      return parents.join(', ') || 'None'
    },
    /**
     * Formats rank, usually for organization
     * @param {string} rank
     * @returns {string} text of rank
     */
    formatOrganizationRank(rank) {
      return this.$api.organization.getValidRankByValue(rank).text
    },
    /**
     * Makes first character of string lowercase
     * @param {string} string
     * @returns {string} string with lowercase first char
     */
    lowerCaseFirstChar(string) {
      return string.charAt(0).toLowerCase() + string.slice(1)
    },
    /**
     * Formats groups from item
     * @param {any} item
     * @returns {string} text of item groups
     */
    getGroupsString(item) {
      const groups = item.groups.join(', ')
      return groups || 'None'
    },
    /**
     * Helper function for navigating to edit page of item type
     * @param {string} type of item
     * @param {string} id of item
     */
    navigateToEdit(type, id) {
      this.rtr.push({ name: `${type}Edit`, params: { id }, query: { next: this.$route.path } })
    },
    /**
     * Helper function for navigating to edit page of item type
     * @param {string} type of item
     * @param {string} item
     */
    navigateToCopy(type, item) {
      this.rtr.push({ name: `${type}Copy`, params: { item } })
    },
    /**
     * Helper function for navigating to detail page of item type
     * @param {string} type of item
     * @param {string} id of item
     */
    navigateToDetail(type, id) {
      this.rtr.push({ name: `${type}Detail`, params: { id }, query: { next: this.$route.path } })
    },
    /**
     * Helper function for navigating to create page of item type
     * @param {string} type of item
     * @param {string} id of item
     */
    navigateToCreate(type) {
      this.rtr.push({ name: `${type}Create`, query: { next: this.$route.path } })
    },
    /**
     * Get format string from boolean
     * @param {boolean} activeBool
     * @returns {string} formatted string
     */
    getFormattedActive(activeBool) {
      return activeBool ? 'Active' : 'Inactive'
    },
    /**
     * Split string on capital letters, good for separated PascalCase or camelCase words
     * @param {string} word to split
     * @returns {array} of strings
     */
    splitOnCapitals(word) {
      return word.split(/(?=[A-Z])/)
    },
    /**
     * Check if email is valid
     * @param {string} email
     * @returns {boolean}
     */
    isEmailValid(email) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    },
  },
  computed: {
    // Default delay for rerouting, usually on successful user action with feedback
    routeDelay() {
      return 2000
    },
    // Router reference
    rtr() {
      return this.$router
    },
    // Route reference
    rt() {
      return this.$route
    },
    // Default items displayed on list components
    defaultItemsPerPage() {
      return 10
    },
    // Default page options for list components
    defaultItemsPerPageOptions() {
      return [10, 20, { text: 'All', value: -1 }]
    },
    /**
     * Collection of rules for v-form fields.
     * @returns {object}
     */
    formRules() {
      return {
        /**
         * Checks if value is empty or falsey, based on type
         * @param {any} v
         * @returns {boolean | string}
         */
        generic: [
          (v) => {
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
          },
        ],
        /**
         * Checks if value is positive number
         * @param {any} v
         * @returns {boolean | string}
         */
        positiveNumber: [baseRule, numericRule, positiveRule, nonZeroRule],
        /**
         * Checks if value is a valid email
         * @param {any} v
         * @returns {boolean | string}
         */
        email: [baseRule, (v) => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'E-mail must be valid'],
        /**
         * Checks if value is valid currency
         * @param {any} v
         * @returns {boolean | string}
         */
        currency: [baseRule, (v) => parseFloat(v) * 100 !== 0 || 'Value cannot be 0'],
        /**
         * Checks if value is valid contactable
         * @param {any} v
         * @returns {boolean | string}
         */
        contactable: [baseRule, (v) => (!!v.firstName && !!v.lastName) || requiredFieldString],
      }
    },
  },
}
