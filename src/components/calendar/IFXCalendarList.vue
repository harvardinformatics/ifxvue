<script>
import { mapActions } from 'vuex'
import cloneDeep from 'lodash/cloneDeep'
import moment from 'moment-timezone'

export default {
  name: 'IFXCalendarList',
  props: {
    id: {
      default: '',
      type: String,
    },
    isEditing: {
      default: false,
      type: Boolean,
    },
    showPopup: {
      default: false,
      type: Boolean,
    },
    showPanel: {
      default: false,
      type: Boolean,
    },
    useMaintenance: {
      default: false,
      type: Boolean,
    },
    useTrial: {
      default: false,
      type: Boolean,
    },
    startTime: {
      default: 0,
      type: Number,
    },
  },
  data: () => ({
    calHeight: '900',
    calModel: '',
    type: 'month',
    typeToLabel: {
      month: 'Month',
      week: 'Week',
      day: 'Day',
    },
    newEvent: {},
    selectedEvent: {},
    selectedElement: null,
    selectedOpen: false,
    formIsValid: false,
    startDateMenu: false,
    endDateMenu: false,
    pickerDate: '',
    pickerTime: '',
    duration: [],
    durationValue: null,
    isRepeatingReservation: false,
    isMaintenance: false,
    isEditable: true,
    trial: false,
    approved: true,
    eventsAreLoading: true,
    repeatChoices: ['Day', 'Week', 'Month', 'Year', 'Custom...'],
    customRepeatChoices: ['Day(s)', 'Week(s)', 'Month(s)'],
    repeatFrequency: '',
    customRepeatFrequency: '',
    repeatCount: 1,
    daysOfTheWeek: [],
    daysOfTheMonth: '',
    monthRepeatType: 'individual',
    monthPatternRepeatChoices: ['First', 'Second', 'Third', 'Fourth', 'Fifth', { divider: true }, 'Last'],
    monthPatternOffset: '',
    monthPatternRepeatDayChoices: [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      { divider: true },
      'Day',
      'Weekday',
    ],
    monthPatternRepeatDay: '',
    resource: {},
    allowedMinutes: [0],
    parseFormats: ['M/DD/YYYY h:mm A', 'M/DD/YYYY h:mmA'],
    comments: '',
    currentUser: {},
    items: [],
    users: [],
    user: null,
    allowedOrgs: [],
    allowedExpenseCodes: [],
    filteredResources: [],
    expenseCode: null,
    organization: null,
    errorMsg: '',
    showErrorMsg: false,
    skinnyUsers: [],
    attendants: [],
    allResources: [],
    reservationOpen: false,
    earliestMonth: null,
    latestMonth: null,
    startingDate: moment.tz('America/New_York').valueOf(),
    diffFromEastern: 0,
  }),
  async mounted() {
    const now = moment.tz('America/New_York')
    this.diffFromEastern = -(now.utcOffset() + new Date().getTimezoneOffset())
    this.earliestMonth = now.subtract(1, 'month').startOf('month').toISOString()
    this.latestMonth = now.add(2, 'month').endOf('month').toISOString()

    this.type = this.$api.storage.getItem('calendarType', 'local') || this.type

    this.newEvent = this.$api.reservationUsage.create({})
    this.currentUser = await this.$api.auth.getCurrentUserRecord()
    if (this.canReserveForOthers) {
      this.users = await this.$api.user.getList()
    }
    this.allResources = await this.$api.resource.getList()
    const unsortedUsers = await this.$api.skinnyUser.getList()
    this.skinnyUsers = unsortedUsers.sort((a, b) => {
      if (a.lastName.toLowerCase() === b.lastName.toLowerCase()) {
        if (a.firstName.toLowerCase() === b.firstName.toLowerCase()) {
          return 0
        }
        return a.firstName.toLowerCase() > b.firstName.toLowerCase() ? 1 : -1
      }
      return a.lastName.toLowerCase() > b.lastName.toLowerCase() ? 1 : -1
    })
    this.eventsAreLoading = true
    this.clearReservation()
    this.reservationOpen = this.showPanel
    this.items = await this.$api.reservationUsage.getList({
      start_date: this.earliestMonth,
      end_date: this.latestMonth,
    })
    if (this.isEditing || this.showPopup) {
      // Load the event corresponding to the passed in id
      const theId = parseInt(this.id, 10)
      const theItem = await this.$api.reservationUsage.getByID(theId)
      // Make sure this date is visible. Get the yy-mm-dd part of the start date
      const pieces = theItem.startDate.split('T')
      if (pieces[0]) {
        this.startingDate = pieces[0]
        this.moved({ date: this.startingDate })
      }
      if (theItem) {
        if (this.isEditing) {
          await this.editReservation(theItem)
        }
        if (this.showPopup) {
          this.selectedElement = this.$refs.calendar
          this.selectedEvent = theItem
          const theResource = this.allResources.find((resource) => resource.id === theItem.product.id)
          this.resource = theResource
          this.selectedOpen = true
        }
      }
    }
    this.setDefaultFilteredResources()
    this.eventsAreLoading = false
    // Kick off time updates
    this.$refs.calendar.checkChange()
    this.updateTime()
  },
  computed: {
    humanStartDate() {
      return this.newEvent.startDate ? this.newEvent.startDateAsMoment.format('M/DD/YYYY h:mm A') : ''
    },
    humanEndDate() {
      return this.newEvent.endDate ? this.newEvent.endDateAsMoment.format('M/DD/YYYY h:mm A') : ''
    },
    resourceNotSelected() {
      return !(this.resource && Object.keys(this.resource).length)
    },
    filteredEvents() {
      // Filter the list of items based on the requested resources.
      // If there are no requested resources, show all items
      return this.filteredResources.length
        ? this.items.filter((item) => this.filteredResources.some((resource) => item.product.name === resource.name))
        : this.items
    },
    cantBeEdited() {
      if (this.weAreEditing) {
        // This is editing an existing reservation. Check if it is editable
        return !this.canEditReservation(this.newEvent)
      }
      return false
    },
    weAreEditing() {
      return this.newEvent.id >= 0
    },
    expenseCodeRequired() {
      const result = !this.resourceNotSelected
        && this.resource?.billable
        && !(this.isMaintenance && this.useMaintenance)
        && !(this.trial && this.useTrial)
      return result
    },
    expenseCodeEnabled() {
      return (
        (!this.resourceNotSelected
          && this.resource?.billable
          && !(this.isMaintenance && this.useMaintenance)
          && !(this.trial && this.useTrial))
        || this.$api.auth.can('always-assign-expense-code', this.$api.authUser)
      )
    },
    justSelectedResources() {
      // If there are no requested resources, show all resources
      return this.filteredResources.length ? this.filteredResources : this.allResources
    },
  },
  methods: {
    ...mapActions(['showMessage']),
    setDefaultFilteredResources() {
      // If this.resource is set (ie there was an id prop), use that as the filtered resource
      // otherwise, check local storage
      if (this.id && this.resource) {
        this.filteredResources.push(this.resource)
      } else {
        const ids = this.$api.storage.getItem('filteredResources', 'local')?.split(',')
        if (ids?.length) {
          this.filteredResources = ids.map((id) => this.allResources.find((resource) => resource.id === parseInt(id, 10)))
        }
      }
    },
    viewDay({ date }) {
      this.calModel = date
      this.type = 'day'
      this.setDefaultStartDate(date)
    },
    closeReservation() {
      this.clearReservation()
      this.reservationOpen = false
    },
    setCalendarType(type) {
      this.type = type
      this.$api.storage.setItem('calendarType', type, 'local')
    },
    getEventColor(event) {
      if (this.useMaintenance && event.reservation.isMaintenance) {
        return this.$api.reservation.getMaintenanceColor()
      }
      if (this.useTrial && event.reservation.trial) {
        return this.$api.reservation.getTrialColor()
      }
      return this.getResourceColor(event)
    },
    shortenLabName(labSlug) {
      let eventString = ''
      const orgName = this.$options.filters.orgNameFromSlug(labSlug)
      const orgNamePieces = orgName.split(' ')
      if (orgNamePieces.length > 2 && orgNamePieces[orgNamePieces.length - 1] === 'Lab') {
        eventString += orgNamePieces.slice(-2).join(' ')
      } else {
        eventString = orgName
      }
      return eventString
    },

    isEventTimed() {
      // All reservations are timed (i.e. are not all-day events)
      return true
    },
    getResourceColor(RU) {
      const resId = RU.product.id
      if (RU.cancelled) {
        return 'blue-grey lighten-3'
      }
      const theResource = this.allResources.find((resource) => resource.id === resId)
      return theResource ? theResource.color : 'grey'
    },
    setToday() {
      this.calModel = ''
      const today = new Date()
      this.setDefaultStartDate(today)
    },
    prev() {
      this.$refs.calendar.prev()
    },
    next() {
      this.$refs.calendar.next()
    },
    moved(event) {
      // The user has clicked the back/forward button. Figure out if we've already fetched
      // the reservations for this time period.
      const newNow = moment.tz(event.date, 'America/New_York')
      if (newNow.isBefore(this.earliestMonth)) {
        const newEarliest = newNow.subtract(1, 'month').startOf('month').toISOString()
        const oldEarliest = this.earliestMonth
        this.earliestMonth = newEarliest
        this.eventsAreLoading = true
        this.$api.reservationUsage
          .getList({ start_date: newEarliest, end_date: oldEarliest })
          .then((newItems) => {
            this.items = newItems.concat(this.items)
            this.eventsAreLoading = false
          })
          .catch((err) => {
            this.showMessage(err)
            this.earliestMonth = oldEarliest
            this.eventsAreLoading = false
          })
      } else if (newNow.isAfter(this.latestMonth)) {
        const newLatest = newNow.add(2, 'month').endOf('month').toISOString()
        const oldLatest = this.latestMonth
        this.latestMonth = newLatest
        this.eventsAreLoading = true
        this.$api.reservationUsage
          .getList({ start_date: newLatest, end_date: oldLatest })
          .then((newItems) => {
            this.items = newItems.concat(this.items)
            this.eventsAreLoading = false
          })
          .catch((err) => {
            this.showMessage(err)
            this.latestMonth = oldLatest
            this.eventsAreLoading = false
          })
      }
    },
    showEvent({ nativeEvent, event }) {
      const open = () => {
        this.selectedEvent = event
        this.selectedElement = nativeEvent.target
        requestAnimationFrame(() => requestAnimationFrame(() => (this.selectedOpen = true)))
      }

      if (this.selectedOpen) {
        this.selectedOpen = false
        requestAnimationFrame(() => requestAnimationFrame(() => open()))
      } else {
        open()
      }

      nativeEvent.stopPropagation()
    },
    handleDayClick(calEvent) {
      if (!this.cantBeEdited) {
        this.setDefaultStartDate(calEvent.date)
      }
      this.reservationOpen = true
    },
    minDate() {
      return new Date().toISOString()
    },
    setDefaultStartDate(dateToUse) {
      const dateObject = moment.tz(dateToUse, 'America/New_York')
      this.pickerDate = dateObject.toISOString().substr(0, 10)
      const nextHour = new Date().getMinutes() < 31 ? 1 : 2
      this.pickerTime = moment.tz('America/New_York').add(nextHour, 'hour').startOf('hour').format('HH:mm')
      this.newEvent.startDate = null
      this.$nextTick(() => {
        this.addValuesFromDatepicker('startDate', this.pickerDate, this.pickerTime)
      })
    },
    addValuesFromDatepicker(whichDate, pickerDate, pickerTime) {
      const dateObject = moment.tz(`${pickerDate}T${pickerTime}:00`, 'America/New_York')
      const newValue = dateObject.toISOString()
      this.newEvent[whichDate] = newValue
      if (whichDate === 'startDate') {
        this.startDateMenu = false
      } else this.endDateMenu = false
    },
    canSetRepeatingEvents() {
      return this.$api.auth.can('set-repeating-events', this.$api.authUser)
    },
    canSetMaintanence() {
      return this.$api.auth.can('set-maintanence', this.$api.authUser)
    },
    canSetEditable() {
      return this.$api.auth.can('set-editable', this.$api.authUser)
    },
    canReserveForOthers() {
      return this.$api.auth.can('reserve-for-others', this.$api.authUser)
    },
    canEditReservation(item) {
      if (Object.keys(item).length) {
        // First check if this is admin
        if (this.$api.auth.can('set-editable', this.$api.authUser)) {
          return true
        }
        return this.isWithinModifyWindow(item) && !item.cancelled
      }
      return false
    },
    canDeleteReservation(item) {
      if (Object.keys(item).length) {
        // First check if this is admin
        if (this.$api.auth.can('delete-reservation', this.$api.authUser)) {
          return true
        }
        return this.isWithinModifyWindow(item) && !item.cancelled
      }
      return false
    },
    canCancelReservation(item) {
      return this.$api.auth.can('cancel-reservation', this.$api.authUser) && !item.cancelled
    },
    canApprove() {
      return this.$api.auth.can('approve-reservation', this.$api.authUser)
    },
    isWithinModifyWindow(item) {
      // Check if the modifyAfterCreation time has past or if the modifyBeforeReservation time is active
      const product = this.allResources.find((res) => res.id === item.product.id)
      const parameters = product.reservationRuleSet.rules.map((rule) => rule.reservationRule.parameters)
      let param = parameters.find((p) => p.modifyAfterCreation)
      let insideTimeWindow = true
      if (param?.modifyAfterCreation) {
        // Get the units involved
        const units = product.reservationRuleSet.parameterUnits.modify_after_creation
        insideTimeWindow = moment
          .tz(item.created, 'America/New_York')
          .add(param.modifyAfterCreation, units)
          .isAfter(moment.tz('America/New_York'))
      }
      param = parameters.find((p) => p.modifyBeforeReservation)
      if (param?.modifyBeforeReservation) {
        // Get the units involved
        const units = product.reservationRuleSet.parameterUnits.modify_before_reservation
        insideTimeWindow = insideTimeWindow
          && moment
            .tz('America/New_York')
            .isBefore(moment.tz(item.startDate, 'America/New_York').subtract(param.modifyBeforeReservation, units))
      }
      // Check if we're in the past and disallow editing
      insideTimeWindow = insideTimeWindow && !this.isInThePast(item)
      return insideTimeWindow && item.productUser.id === this.currentUser.id && item.reservation.isEditable
    },
    isInThePast(item) {
      // return new Date(item.startDate).getTime() <= new Date().getTime()
      return moment.tz(item.startDate, 'America/New_York').isSameOrBefore(moment.tz('America/New_York'))
    },
    dayOfMonthHeader() {
      return 'Select day on which to repeat'
    },
    clearReservation() {
      if (this.$refs.reserveForm) {
        this.$refs.reserveForm.reset()
      }
      this.$nextTick(() => {
        this.newEvent = this.$api.reservationUsage.create({})
        this.setDefaultStartDate(this.minDate())
        this.isRepeatingReservation = false
        this.isMaintenance = false
        this.trial = false
        this.isEditable = true
        this.approved = true
        this.repeatFrequency = ''
        this.customRepeatFrequency = ''
        this.repeatCount = 1
        this.daysOfTheWeek = []
        this.daysOfTheMonth = []
        this.resource = this.justSelectedResources[0]
        this.attendants = []
        this.user = this.currentUser
        this.expenseCode = null
        this.getAllOrgs(this.user)
        this.handleResourceChange(this.resource)
        this.errorMsg = ''
        this.showErrorMsg = false
      })
    },
    getMinMaxDays() {
      const now = moment.tz('America/New_York')
      return {
        min: now.startOf('month').format('YYYY-MM-DD'),
        max: now.endOf('month').format('YYYY-MM-DD'),
      }
    },
    openPickers(whichDate) {
      if (this.newEvent[whichDate]) {
        const theDateTime = moment.tz(this.newEvent[whichDate], 'America/New_York')
        this.pickerDate = theDateTime.format('YYYY-MM-DD')
        this.pickerTime = theDateTime.format('H:mm')
      }
      if (whichDate === 'startDate') {
        this.startDateMenu = true
      } else this.endDateMenu = true
    },
    updateDate(value, whichDate) {
      const theDateTime = moment.tz(value, this.parseFormats, 'America/New_York')
      this.newEvent[whichDate] = theDateTime.toISOString()
      if (whichDate === 'startDate' && this.durationValue) {
        this.setEndTime(this.durationValue, false)
      }
      this.revalidateTimes()
    },
    dateTimeRule(v) {
      return (
        /^(\d{1,2})\/(\d{1,2})\/(\d{4}) (1?\d):(\d{2}) ([aA]|[pP])[mM]$/.test(v)
        || 'Date and time must be MM/DD/YYYY HH:MM AM/PM'
      )
    },
    checkIsAfterStart(v) {
      return (
        moment
          .tz(v, this.parseFormats, 'America/New_York')
          .isAfter(moment.tz(this.newEvent.startDate, 'America/New_York')) || 'Reservation end must be after start'
      )
    },
    checkIsBeforeEnd(v) {
      if (this.newEvent.endDate) {
        return (
          moment
            .tz(v, this.parseFormats, 'America/New_York')
            .isBefore(moment.tz(this.newEvent.endDate, 'America/New_York')) || 'Reservation start must be before end'
        )
      }
      return true
    },
    checkInPast(v) {
      return (
        moment.tz(v, this.parseFormats, 'America/New_York').isAfter(moment.tz('America/New_York'))
        || this.$api.auth.can('add-reservations-in-the-past')
        || 'Cannot set reservations in the past'
      )
    },
    checkSpansMonth(v) {
      if (this.resource.billable) {
        return (
          moment
            .tz(v, this.parseFormats, 'America/New_York')
            .isSame(moment.tz(this.newEvent.startDate, 'America/New_York'), 'month') || 'Reservation cannot span months'
        )
      }
      return true
    },
    isBillableRule(v) {
      if (!this.expenseCodeRequired) {
        return true
      }
      return (v && v.length !== 0) || 'An expense code or PO is required'
    },
    setEndTime(value, validate = true) {
      this.newEvent.endDate = moment.tz(this.newEvent.startDate, 'America/New_York').add(value, 'minutes').toISOString()
      if (validate) {
        this.revalidateTimes()
      }
    },
    async reserveResource() {
      // Check if there are two green-badged people, including the reserver
      // Put up a warning if not.
      const useSpecialMsg = this.$api.reservation.useSpecialMsg(this.resource, this.attendants)

      if (this.newEvent.id) {
        // This is an existing event. Replace it
        // Get our existing reservation
        const resUsage = this.buildPayload(this.newEvent)
        try {
          const res = await this.$api.reservationUsage.update(resUsage)
          let msg = `Updated reservation of ${resUsage.product.name} for ${resUsage.productUser.fullName}.`
          if (useSpecialMsg) {
            msg += ` ${this.$api.reservation.getSpecialMessage()}`
          }
          this.showMessage(msg)
          const returnedRU = await this.$api.reservationUsage.create(res.data)
          const eIndex = this.items.findIndex((e) => e.id === this.newEvent.id)
          if (eIndex !== -1) {
            this.items.splice(eIndex, 1, returnedRU)
          }
          this.clearReservation()
        } catch (err) {
          const msg = `Could not update reservation of ${resUsage.product.name}.`
          const reasons = err.response?.data?.reservation_usage
          this.errorMsg = `${msg} Please fix the following errors:<br/><br/>${reasons.join('<br/>')}`
          this.showErrorMsg = true
          this.$vuetify.goTo(0)
        }
      } else {
        // This is a new event. Add it
        // Get an empty reservation object
        const resUsage = this.buildPayload(this.$api.reservationUsage.create())
        try {
          const res = await this.$api.reservationUsage.save(resUsage)
          let msg = `Reserved ${resUsage.product.name} for ${resUsage.productUser.fullName}.`
          if (useSpecialMsg) {
            msg += ` ${this.$api.reservation.getSpecialMessage()}`
          }
          this.showMessage(msg)
          const returnedRU = this.$api.reservationUsage.create(res.data)
          this.items.push(returnedRU)
          this.clearReservation()
        } catch (err) {
          const msg = `Could not reserve ${resUsage.product.name}.`
          const reasons = err.response.data?.reservation_usage
          if (reasons) {
            this.errorMsg = `${msg} Please fix the following errors:<br/><br/>${reasons.join('<br/>')}`
            this.showErrorMsg = true
            this.$vuetify.goTo(0)
          } else {
            this.showMessage(err)
          }
        }
      }
      // Check if there is a ?next queryParam and go there if there is
      if (!this.showErrorMsg && this.$route.query.next) {
        this.$router.push({ path: this.$route.query.next })
      } else {
        this.$nextTick(() => {
          this.$refs.calendar.checkChange()
        })
      }
    },
    buildPayload(reservationUsage) {
      const resUsage = cloneDeep(reservationUsage)
      resUsage.product = this.resource
      resUsage.productUser = this.user
      resUsage.startDate = this.newEvent.startDateAsMoment.toISOString()
      resUsage.endDate = this.newEvent.endDateAsMoment.toISOString()
      resUsage.organization = this.organization
      resUsage.reservation.comment = this.comments
      resUsage.reservation.isMaintenance = this.isMaintenance
      resUsage.reservation.trial = this.trial
      resUsage.reservation.approved = this.approved
      resUsage.reservation.isEditable = this.isEditable
      resUsage.reservation.attendants = this.attendants.concat()
      if (resUsage.product.billable && !resUsage.reservation.trial) {
        // Non-admins set the code
        if (!this.$api.auth.can('reserve-billable-without-code')) {
          resUsage.reservation.accounts = [{ account: this.expenseCode }]
        } else if (this.expenseCode) {
          // For admins, only set the code if one was selected
          resUsage.reservation.accounts = [{ account: this.expenseCode }]
        }
      } else {
        delete resUsage.reservation._data.accounts
      }
      resUsage.ignore = false
      return resUsage
    },
    async editReservation(item) {
      this.newEvent.startDate = null
      const newItem = await this.$api.reservationUsage.getByID(item.id)
      this.newEvent = newItem
      const theResource = this.allResources.find((resource) => resource.id === newItem.product.id)
      this.resource = theResource
      this.comments = newItem.reservation.comment
      const theUser = this.canReserveForOthers
        ? this.users.find((user) => user.id === newItem.productUser.id)
        : this.currentUser
      this.user = theUser
      this.getAllOrgs(this.user)
      this.organization = newItem.organization
      this.handleResourceChange(theResource)
      this.selectedOpen = false
      this.attendants = newItem.reservation.attendants.map((attendant) => attendant)
      this.durationValue = newItem.quantity
      this.isMaintenance = newItem.reservation.isMaintenance
      this.trial = newItem.reservation.trial
      this.approved = newItem.reservation.approved
      this.isEditable = newItem.reservation.isEditable
      this.expenseCode = newItem.reservation.accounts[0]?.account
      this.reservationOpen = true
    },
    async deleteReservation(item) {
      const theResource = this.allResources.find((resource) => resource.name === item.product.name)
      /* eslint-disable no-alert */
      if (window.confirm(`Are you sure you want to delete this reservation for ${theResource.name}?`)) {
        // This is an existing event. Delete it
        // Get our existing reservation
        const resUsage = this.buildPayload(item)
        try {
          await this.$api.reservationUsage.delete(resUsage)
          const msg = `Deleted ${theResource.name} for ${resUsage.productUser.fullName}.`
          this.showMessage(msg)
          const eIndex = this.items.findIndex((e) => e.id === item.id)
          if (eIndex !== -1) {
            this.items.splice(eIndex, 1)
          }
          this.clearReservation()
        } catch (err) {
          const msg = `Could not delete reservation for ${theResource.name}.`
          this.showMessage(msg)
          const reasons = err.response.data?.reservation_usage
          this.errorMsg = `${msg} Please fix the following errors:<br/><br/>${reasons.join('<br/>')}`
          this.showErrorMsg = true
          this.$vuetify.goTo(0)
        }
        this.selectedOpen = false
        this.$nextTick(() => {
          this.$refs.calendar.checkChange()
        })
      }
      /* eslint-enable no-alert */
    },
    async cancelReservation(item) {
      const theResource = this.allResources.find((resource) => resource.name === item.product.name)
      // This is an existing event. cancel it
      // Get our existing reservation
      const resUsage = cloneDeep(item)
      resUsage.cancelled = true
      try {
        const res = await this.$api.reservationUsage.update(resUsage)
        const msg = `Cancelled  ${theResource.name} for ${resUsage.productUser.fullName}.`
        this.showMessage(msg)
        const returnedRU = await this.$api.reservationUsage.create(res.data)
        const eIndex = this.items.findIndex((e) => e.id === item.id)
        if (eIndex !== -1) {
          this.items.splice(eIndex, 1, returnedRU)
        }
        this.clearReservation()
      } catch (err) {
        const msg = `Could not cancel reservation for ${theResource.name}.`
        this.showMessage(msg)
        const reasons = err.response.data?.reservation_usage
        this.errorMsg = `${msg} Please fix the following errors:<br/><br/>${reasons.join('<br/>')}`
        this.showErrorMsg = true
        this.$vuetify.goTo(0)
      }
      this.$nextTick(() => {
        this.$refs.calendar.checkChange()
      })
    },
    getAllOrgs(user) {
      // Build a list of all organizations with which this user is affiliated
      this.allowedOrgs = []
      this.allowedOrgs.push(user.primaryAffiliation)
      this.organization = user.primaryAffiliation
      user.affiliations.forEach((affiliation) => {
        if (affiliation.active) {
          this.allowedOrgs.push(affiliation.organization)
        }
      })
      // Now get the list of allowable expense codes
      this.getAllExpenseCodes(user)
      // Now validate the expenseCode field. This will highlight that it needs to be set
      this.$nextTick(() => this.$refs.expenseCode?.validate(true))
    },
    getAllExpenseCodes(user) {
      // Build a list of all expense codes available to this user
      this.expenseCode = null
      this.allowedExpenseCodes.splice(0)

      if (this.$api.auth.can('assign-any-code', this.$api.authUser)) {
        this.$api.account.getList({ active: true }).then((res) => (this.allowedExpenseCodes = res))
      } else {
        // Now do regular accounts
        let match = this.findExpenseCode(user.accounts, 'User')
        if (match.length) {
          this.allowedExpenseCodes = this.allowedExpenseCodes.concat(match)
          this.expenseCode = this.resource.billable ? match[0].slug : null
        }
        if (user.productAccounts?.length) {
          match = this.findExpenseCode(user.productAccounts, 'User Product')
          if (match.length) {
            this.allowedExpenseCodes = this.allowedExpenseCodes.concat(match)
            this.expenseCode = this.resource.billable ? match[0].slug : null
          }
        }
      }
    },
    findExpenseCode(accounts, accountTypeString) {
      const matchingAccounts = []
      accounts.forEach((account) => {
        let isAMatch = account.account.organization === this.organization && account.account.active && account.isValid
        if (isAMatch && accountTypeString === 'User Product') {
          isAMatch = isAMatch && account.product.name === this.resource?.name
        }
        if (isAMatch) {
          matchingAccounts.push(account.account)
        }
      })
      return matchingAccounts
    },
    removeFromSelected(item) {
      const index = this.attendants.findIndex((attendant) => attendant.id === item.id)
      if (index !== -1) {
        this.attendants.splice(index, 1)
      }
    },
    removeFromFiltered(item) {
      const index = this.filteredResources.findIndex((resource) => resource.id === item.id)
      if (index !== -1) {
        this.filteredResources.splice(index, 1)
      }
    },
    handleResourceChange(resource) {
      const parameters = resource.reservationRuleSet.rules.map((rule) => rule.reservationRule.parameters)
      let minLength = 5
      let unitLength = 5
      parameters.forEach((param) => {
        if (param.minLength && param.minLength > minLength) {
          minLength = param.minLength
        }
        if (param.unitLength && param.unitLength > unitLength) {
          unitLength = param.unitLength
        }
      })
      // Build duration list. It will be the minLength and then 8-10 iterations of the unit length
      const numberOfEntries = 10
      this.duration = []
      const durationText = 'minute'

      let index = -1
      let count = 0
      while (count < numberOfEntries) {
        index++
        const value = minLength + unitLength * index
        // Always let the minLength be available
        if (index !== 0 && value % 30 !== 0) {
          continue
        }
        let textOfLength = value
        let textOfDuration = durationText
        if (value / 60 >= 1) {
          textOfDuration = 'hour'
          textOfLength /= 60
        }
        this.duration.push({
          value,
          text: `${textOfLength} ${this.handlePlural(textOfLength, textOfDuration)}`,
        })
        if (value >= 60 * 5) {
          break
        }
        count++
      }
      // Now build list of acceptable times within the hour
      this.allowedMinutes = []
      const blocksPerHours = 60 / unitLength
      for (let i = 0; i < blocksPerHours; i++) {
        this.allowedMinutes.push(i * (60 / blocksPerHours))
      }
      // Now update the list of expense code since there might be "user product" codes for this resource
      this.getAllExpenseCodes(this.user)
      if (this.$refs.reserveForm) {
        this.$refs.reserveForm.validate()
      }
    },
    handlePlural(amount, text) {
      return amount === 1 ? text : `${text}s`
    },
    getAccountDisplay(item) {
      // Return a list of the friendly names of the accounts
      return item.reservation.accounts
        .map(({ account }) => {
          let result = account
          if (account) {
            // parse a slug
            const match = account.match(/(.+?) \((.+?)\)$/)
            if (match.length) {
              // If the first three characters are "PO<space>", we've got a PO
              if (match[1].startsWith('PO ')) {
                result = match[1].substr(3)
              } else {
                result = match[2]
              }
            }
          }
          return result
        })
        .join(', ')
    },
    showAccountDisplay(item) {
      const theResource = this.allResources.find((res) => res.id === item.product.id)
      if (theResource?.billable) {
        return true
      }
      return false
    },
    closePopup() {
      this.selectedOpen = false
      if (this.showPopup && this.$route.query.next) {
        this.$router.push({ path: this.$route.query.next })
      }
    },
    toggleIsTrial(value) {
      if (value) {
        this.expenseCode = ''
      }
      this.$refs.expenseCode.validate(true)
      this.approved = !value
    },
    updateTime() {
      setInterval(() => {
        if (this.$refs.calendar) {
          this.$refs.calendar.updateTimes()
        }
      }, 60 * 1000)
    },
    nowY() {
      const now = { ...this.$refs.calendar.times.now }
      // Adjust hour so it is in Eastern Time.
      now.hour -= this.diffFromEastern / 60
      return this.$refs.calendar ? `${this.$refs.calendar.timeToY(now)}px` : '-10px'
    },
    revalidateTimes() {
      this.$refs.startDate.validate(true)
      this.$refs.endDate.validate(true)
    },
  },
  watch: {
    filteredResources() {
      // Store filtered resource ids in local storage unless page was accessed by edit link
      // where the resource filter is set to the resource of the link
      if (!this.id) {
        this.$api.storage.setItem(
          'filteredResources',
          this.filteredResources?.map((resource) => resource.id.toString()).join(',') || null,
          'local'
        )
        this.resource = this.justSelectedResources[0]
        this.handleResourceChange(this.resource)
      }
    },
  },
}
</script>
<template>
  <div class="fill-height">
    <v-row>
      <v-col>
        <v-alert v-model="showErrorMsg" type="error" dismissible><span v-html="errorMsg"></span></v-alert>
      </v-col>
    </v-row>
    <v-row>
      <v-col class="d-flex justify-center">
        <v-spacer></v-spacer>
        <v-autocomplete
          label="Select resources to view"
          hint="Only show reservations for the selected resources. If empty, show all reservations"
          persistent-hint
          :items="allResources"
          item-text="name"
          return-object
          clearable
          clear-icon="mdi-close-circle"
          multiple
          hide-selected
          v-model="filteredResources"
          data-cy="filter-resources"
        >
          <template #selection="{ item }">
            <v-chip :color="item.color" text-color="black" close @click:close="removeFromFiltered(item)">
              {{ item.name }}
            </v-chip>
          </template>
          <template #item="{ item }">
            <div :style="$api.resource.resourceColorBox(item)" class="mr-2">&nbsp;</div>
            {{ item.name }}
          </template>
        </v-autocomplete>
        <v-spacer></v-spacer>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-sheet height="64">
          <v-toolbar flat>
            <v-btn outlined class="mr-4" color="grey darken-2" @click="setToday" data-cy="calendar-today">Today</v-btn>
            <v-btn fab text small color="grey darken-2" @click="prev" data-cy="calendar-prev">
              <v-icon small>mdi-chevron-left</v-icon>
            </v-btn>
            <v-btn fab text small color="grey darken-2" @click="next" data-cy="calendar-next">
              <v-icon small>mdi-chevron-right</v-icon>
            </v-btn>
            <v-toolbar-title v-if="$refs.calendar">
              {{ $refs.calendar.title }}
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <span class="font-weight-light">(All times Eastern)</span>
            <v-spacer></v-spacer>
            <v-switch
              v-model="reservationOpen"
              class="mt-5 mr-4"
              color="primary"
              label="Show reservation panel"
              data-cy="show-reservation-panel"
            ></v-switch>
            <v-menu bottom right data-cy="calendar-type">
              <template v-slot:activator="{ on, attrs }">
                <v-btn outlined color="grey darken-2" v-bind="attrs" v-on="on">
                  <span>{{ typeToLabel[type] }}</span>
                  <v-icon right>mdi-menu-down</v-icon>
                </v-btn>
              </template>
              <v-list>
                <v-list-item @click="setCalendarType('day')">
                  <v-list-item-title>Day</v-list-item-title>
                </v-list-item>
                <v-list-item @click="setCalendarType('week')">
                  <v-list-item-title>Week</v-list-item-title>
                </v-list-item>
                <v-list-item @click="setCalendarType('month')">
                  <v-list-item-title>Month</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-toolbar>
        </v-sheet>
        <v-sheet :min-height="calHeight" class="d-flex justify-middle relative">
          <span class="flex-grow-1">
            <v-calendar
              ref="calendar"
              v-model="calModel"
              color="primary"
              :events="filteredEvents"
              event-start="startDate"
              event-end="endDate"
              :event-color="getEventColor"
              :event-timed="isEventTimed"
              :type="type"
              interval-height="60"
              event-text-color="black"
              @click:event="showEvent"
              @click:more="viewDay"
              @click:date="viewDay"
              @click:day="handleDayClick"
              @click:interval="handleDayClick"
              @click:time="handleDayClick"
              @moved="moved"
              :start="startingDate"
              data-cy="calendar"
              :first-interval="startTime"
              :interval-count="24 - startTime"
            >
              <template v-slot:event="item">
                <div
                  :class="{
                    'in-the-past': isInThePast(item.event),
                  }"
                  :data-cy="`event-${item.event.id}`"
                >
                  <strong class="ml-1">{{ item.formatTime(item.eventParsed.start, true) }}</strong>
                  <span
                    :class="{
                      'text-decoration-line-through': item.event && item.event.cancelled,
                    }"
                  >
                    {{ shortenLabName(item.event.organization) }}
                  </span>
                  <div class="ml-1">{{ item.event.productUser.fullName }}</div>
                  <div class="ml-1">{{ item.event.reservation.comment }}</div>
                </div>
              </template>
              <template v-slot:day-body="{ date, week }">
                <div class="v-current-time" :class="{ first: date === week[0].date }" :style="{ top: nowY() }"></div>
              </template>
            </v-calendar>
            <v-progress-linear v-if="eventsAreLoading" indeterminate></v-progress-linear>
          </span>
          <v-expand-x-transition>
            <v-card color="grey lighten-4 ml-4 " min-width="350px" max-width="550px" v-show="reservationOpen">
              <v-card-title class="d-flex justify-space-between">
                Reserve an instrument or location
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn icon small v-on="on" @click="closeReservation" data-cy="close-reservation-panel">
                      <v-icon>mdi-close</v-icon>
                    </v-btn>
                  </template>
                  <span>Close reservation panel</span>
                </v-tooltip>
              </v-card-title>
              <v-card-text>
                <v-form ref="reserveForm" v-model="formIsValid">
                  <v-autocomplete
                    label="Select Resource"
                    required
                    :items="justSelectedResources"
                    item-text="name"
                    return-object
                    auto-select-first
                    v-model="resource"
                    :rules="formRules.generic"
                    @change="handleResourceChange"
                    :disabled="weAreEditing"
                    data-cy="select-resources"
                  ></v-autocomplete>
                  <v-row no-gutters v-if="useTrial || useMaintenance">
                    <v-col cols="8" v-if="useTrial">
                      <v-checkbox
                        class="dense-checkbox"
                        dense
                        label="Testing / Pilot"
                        v-model="trial"
                        @change="toggleIsTrial"
                        :disabled="resourceNotSelected"
                        data-cy="trial-checkbox"
                      ></v-checkbox>
                    </v-col>
                    <v-col cols="4" v-if="useMaintenance">
                      <v-checkbox
                        class="dense-checkbox"
                        dense
                        v-if="canSetMaintanence()"
                        label="Unavailable"
                        v-model="isMaintenance"
                        data-cy="maintenance-checkbox"
                      ></v-checkbox>
                    </v-col>
                  </v-row>
                  <v-autocomplete
                    v-if="canReserveForOthers()"
                    label="User"
                    hint="User on whose behalf this reservation is being made"
                    persistent-hint
                    required
                    :items="users"
                    v-model="user"
                    :rules="formRules.generic"
                    item-text="fullName"
                    return-object
                    @change="getAllOrgs($event)"
                    :disabled="resourceNotSelected"
                    data-cy="user"
                  ></v-autocomplete>
                  <v-autocomplete
                    label="Organizaton"
                    required
                    :items="allowedOrgs"
                    v-model="organization"
                    :rules="formRules.generic"
                    @change="getAllExpenseCodes(user)"
                    :disabled="cantBeEdited || resourceNotSelected"
                    data-cy="organizaton"
                  >
                    <template v-slot:item="{ item }">
                      <span>{{ item | orgNameFromSlug }}</span>
                    </template>
                    <template v-slot:selection="{ item }">
                      <span>{{ item | orgNameFromSlug }}</span>
                    </template>
                  </v-autocomplete>
                  <v-autocomplete
                    label="Expense Code / PO"
                    ref="expenseCode"
                    item-text="name"
                    item-value="slug"
                    :required="expenseCodeRequired"
                    :items="allowedExpenseCodes"
                    v-model="expenseCode"
                    :rules="[isBillableRule]"
                    :disabled="resourceNotSelected || !expenseCodeEnabled"
                    data-cy="expense-code"
                  >
                    <template #no-data>
                      <div class="mx-3 my-1">No expense code or PO found for this organization and resource</div>
                    </template>
                  </v-autocomplete>
                  <v-text-field
                    ref="startDate"
                    class="startDate"
                    :value="humanStartDate"
                    @change="updateDate($event, 'startDate')"
                    label="Start Date and Time *"
                    prepend-icon="mdi-calendar"
                    required
                    hint="MM/DD/YYYY HH:MM AM/PM (all times Eastern)"
                    persistent-hint
                    @click:prepend.stop="openPickers('startDate')"
                    :rules="[dateTimeRule, checkInPast, checkIsBeforeEnd]"
                    :disabled="cantBeEdited || resourceNotSelected"
                    data-cy="start-date"
                  ></v-text-field>
                  <v-menu
                    v-model="startDateMenu"
                    :close-on-content-click="false"
                    :return-value.sync="startDateMenu"
                    :offset-overflow="true"
                    transition="scale-transition"
                    min-width="580px"
                    left
                    offset-x
                    nudge-bottom="20"
                    attach=".startDate"
                    :internal-activator="true"
                  >
                    <div class="d-flex flex-row menu-background">
                      <div class="d-flex flex-column">
                        <v-date-picker
                          v-model="pickerDate"
                          no-title
                          scrollable
                          show-adjacent-months
                          :min="minDate()"
                          data-cy="start-date-picker"
                        ></v-date-picker>
                        <div class="text-center">
                          <v-btn text color="secondary" @click="startDateMenu = false" data-cy="start-date-cancel">
                            Cancel
                          </v-btn>
                          <v-btn
                            text
                            color="primary"
                            :disabled="!pickerTime"
                            @click="addValuesFromDatepicker('startDate', pickerDate, pickerTime)"
                            data-cy="start-date-ok"
                          >
                            OK
                          </v-btn>
                        </div>
                      </div>
                      <v-spacer></v-spacer>
                      <v-time-picker
                        v-model="pickerTime"
                        scrollable
                        ampm-in-title
                        format="ampm"
                        :allowed-minutes="allowedMinutes"
                        data-cy="start-date-time-picker"
                      ></v-time-picker>
                    </div>
                  </v-menu>
                  <v-row>
                    <v-col>
                      <v-autocomplete
                        label="Length of reservation"
                        v-model="durationValue"
                        :items="duration"
                        @change="setEndTime($event, true)"
                        class="my-2"
                        :disabled="cantBeEdited || resourceNotSelected"
                        data-cy="length-select"
                      >
                        <template #no-data>
                          <div class="mx-3 my-1">No options (you must select a resource)</div>
                        </template>
                      </v-autocomplete>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col>
                      <div class="text-divider font-italic text-center">Or set End time directly</div>
                    </v-col>
                  </v-row>
                  <v-text-field
                    ref="endDate"
                    class="endDate"
                    :value="humanEndDate"
                    @change="updateDate($event, 'endDate')"
                    label="End Date and Time *"
                    prepend-icon="mdi-calendar"
                    hint="MM/DD/YYYY HH:MM AM/PM (all times Eastern)"
                    persistent-hint
                    required
                    @click:prepend.stop="openPickers('endDate')"
                    :rules="[dateTimeRule, checkInPast, checkIsAfterStart, checkSpansMonth]"
                    :disabled="cantBeEdited || resourceNotSelected"
                    data-cy="end-date"
                  ></v-text-field>
                  <v-menu
                    v-model="endDateMenu"
                    :close-on-content-click="false"
                    :return-value.sync="endDateMenu"
                    transition="scale-transition"
                    :offset-overflow="true"
                    min-width="580px"
                    left
                    offset-x
                    nudge-bottom="20"
                    attach=".endDate"
                    :internal-activator="true"
                  >
                    <div class="d-flex flex-row menu-background">
                      <div class="d-flow flow-column">
                        <v-date-picker
                          v-model="pickerDate"
                          no-title
                          scrollable
                          show-adjacent-months
                          :min="minDate()"
                        ></v-date-picker>
                        <div class="text-center">
                          <v-btn text color="secondary" @click="endDateMenu = false" data-cy="end-date-cancel">
                            Cancel
                          </v-btn>
                          <v-btn
                            text
                            color="primary"
                            @click="addValuesFromDatepicker('endDate', pickerDate, pickerTime)"
                            data-cy="end-date-ok"
                          >
                            OK
                          </v-btn>
                        </div>
                      </div>
                      <v-spacer></v-spacer>
                      <v-time-picker
                        v-model="pickerTime"
                        scrollable
                        ampm-in-title
                        format="ampm"
                        :allowed-minutes="allowedMinutes"
                        data-cy="end-date-time-picker"
                      ></v-time-picker>
                    </div>
                  </v-menu>
                  <v-autocomplete
                    label="Attendants"
                    :items="skinnyUsers"
                    v-model="attendants"
                    clearable
                    clear-icon="mdi-close-circle"
                    multiple
                    hide-selected
                    return-object
                    hint="Select people who will be in attendance"
                    :disabled="resourceNotSelected"
                    data-cy="attendants"
                  >
                    <template #item="{ item }">
                      <v-icon :color="$api.reservation.getUserIconColor(item)">
                        {{ $api.reservation.getUserIcon() }}
                      </v-icon>
                      <v-list-item v-text="item.fullName"></v-list-item>
                    </template>
                    <template #selection="{ item }">
                      <v-chip color="transparent" close @click:close="removeFromSelected(item)">
                        <v-icon :color="$api.reservation.getUserIconColor(item)" class="mr-2">
                          {{ $api.reservation.getUserIcon() }}
                        </v-icon>
                        {{ item.fullName }}
                      </v-chip>
                    </template>
                  </v-autocomplete>

                  <v-textarea
                    v-model="comments"
                    auto-grow
                    rows="2"
                    label="Comments"
                    :disabled="resourceNotSelected"
                    class="textarea-scroll"
                    data-cy="comments"
                  ></v-textarea>
                  <!-- <v-checkbox
                :disabled="cantBeEdited || resourceNotSelected"
                v-if="canSetRepeatingEvents()"
                label="Repeating reservation"
                v-model="isRepeatingReservation"
              ></v-checkbox> -->
                  <v-row no-gutters>
                    <v-col cols="8">
                      <v-checkbox
                        class="dense-checkbox"
                        dense
                        v-if="canSetEditable()"
                        label="Reservation can be edited"
                        v-model="isEditable"
                        data-cy="editable"
                      ></v-checkbox>
                    </v-col>
                    <v-col cols="4">
                      <v-checkbox
                        class="dense-checkbox"
                        dense
                        v-if="canApprove()"
                        label="Approved"
                        v-model="approved"
                        data-cy="approved"
                      ></v-checkbox>
                    </v-col>
                  </v-row>
                  <div v-if="isRepeatingReservation">
                    <v-row>
                      <v-col>
                        <v-select
                          :items="repeatChoices"
                          v-model="repeatFrequency"
                          label="Repeats every *"
                          data-cy="repeat-select"
                        ></v-select>
                      </v-col>
                    </v-row>
                    <div v-if="repeatFrequency === 'Custom...'">
                      <v-row>
                        <v-col>
                          <v-text-field
                            v-model.number="repeatCount"
                            type="number"
                            label="Every *"
                            prepend-icon="mdi-calendar"
                            persistent-hint
                            :rules="formRules.positiveNumber"
                            data-cy="repeat-number"
                          ></v-text-field>
                        </v-col>
                        <v-col>
                          <v-select
                            :items="customRepeatChoices"
                            v-model="customRepeatFrequency"
                            label="Frequency *"
                            :rules="formRules.generic"
                            data-cy="repeat-frequency"
                          ></v-select>
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col v-if="customRepeatFrequency === 'Week(s)'">
                          Select Day(s) of the week
                          <v-btn-toggle v-model="daysOfTheWeek" dense multiple>
                            <v-btn x-small data-cy="repeat-week-sunday">S</v-btn>

                            <v-btn x-small data-cy="repeat-week-monday">M</v-btn>

                            <v-btn x-small data-cy="repeat-week-tuesday">T</v-btn>

                            <v-btn x-small data-cy="repeat-week-wednesday">W</v-btn>

                            <v-btn x-small data-cy="repeat-week-thursday">T</v-btn>

                            <v-btn x-small data-cy="repeat-week-friday">F</v-btn>

                            <v-btn x-small data-cy="repeat-week-saturday">S</v-btn>
                          </v-btn-toggle>
                        </v-col>
                        <v-col v-else-if="customRepeatFrequency === 'Month(s)'">
                          <v-radio-group v-model="monthRepeatType">
                            <template v-slot:label>
                              <div>Select days on which to repeat</div>
                            </template>
                            <v-radio value="individual">
                              <template v-slot:label>
                                <div class="d-flex flex-column">
                                  <div>On days</div>
                                  <v-date-picker
                                    v-model="daysOfTheMonth"
                                    no-title
                                    :header-date-format="dayOfMonthHeader"
                                    :min="getMinMaxDays().min"
                                    :max="getMinMaxDays().max"
                                    :disabled="monthRepeatType !== 'individual'"
                                    active-picker="DATE"
                                    data-cy="repeat-date-picker"
                                  ></v-date-picker>
                                </div>
                              </template>
                            </v-radio>
                            <v-radio value="pattern">
                              <template v-slot:label>
                                <div>
                                  <div>On the</div>
                                  <v-row>
                                    <v-col>
                                      <v-select
                                        dense
                                        :items="monthPatternRepeatChoices"
                                        v-model="monthPatternOffset"
                                        :disabled="monthRepeatType !== 'pattern'"
                                        data-cy="repeat-month-offset"
                                      ></v-select>
                                    </v-col>
                                    <v-col>
                                      <v-select
                                        dense
                                        :items="monthPatternRepeatDayChoices"
                                        v-model="monthPatternRepeatDay"
                                        :disabled="monthRepeatType !== 'pattern'"
                                        data-cy="repeat-month-day"
                                      ></v-select>
                                    </v-col>
                                  </v-row>
                                </div>
                              </template>
                            </v-radio>
                          </v-radio-group>
                        </v-col>
                      </v-row>
                    </div>
                  </div>
                </v-form>
              </v-card-text>
              <v-card-actions class="d-flex justify-space-between">
                <v-btn text color="secondary" @click="clearReservation" data-cy="reservation-clear">Clear</v-btn>
                <v-btn text color="primary" :disabled="!formIsValid" @click="reserveResource" data-cy="reservation-ok">
                  Reserve
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-expand-x-transition>
          <v-menu
            v-model="selectedOpen"
            :close-on-content-click="false"
            :activator="selectedElement"
            :offset-x="type !== 'day'"
            :offset-y="type === 'day'"
            :nudge-right="type === 'day' ? 100 : 0"
            v-if="selectedOpen"
            min-width="400px"
            transition="slide-x-reverse-transition"
          >
            <v-card color="grey lighten-4" min-width="350px" flat>
              <v-toolbar
                :color="getEventColor(selectedEvent)"
                dense
                :class="{
                  'trial-reservation': !selectedEvent.reservation.approved,
                }"
              >
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn icon small v-on="on" @click="editReservation(selectedEvent)" data-cy="popup-edit">
                      <v-icon>mdi-pencil</v-icon>
                    </v-btn>
                  </template>
                  <span>Edit reservation</span>
                </v-tooltip>
                <v-toolbar-title :class="{ 'text-decoration-line-through': selectedEvent.cancelled }">
                  <span class="ml-2">{{ selectedEvent.product.name }}</span>
                  <v-icon
                    color="red darken-1"
                    class="mb-1 ml-2"
                    v-if="useMaintenance && selectedEvent.reservation.isMaintenance"
                  >
                    mdi-minus-circle
                  </v-icon>
                  <v-icon color="blue darken-2" class="mb-1 ml-2" v-if="!selectedEvent.reservation.approved">
                    mdi-test-tube
                  </v-icon>
                </v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn icon small @click="closePopup" data-cy="popup-close">
                  <v-icon>mdi-close</v-icon>
                </v-btn>
              </v-toolbar>
              <v-card-text class="text-body-1" v-if="Object.keys(selectedEvent).length">
                <v-row no-gutters>
                  <v-col cols="4"><div>User</div></v-col>
                  <v-col>
                    <span class="font-weight-medium" data-cy="popup-user">
                      {{ selectedEvent.productUser.fullName }}
                      <v-icon
                        :color="$api.reservation.getUserIconColor(selectedEvent.productUser)"
                        class="ml-1 mb-1"
                        small
                      >
                        {{ $api.reservation.getUserIcon() }}
                      </v-icon>
                    </span>
                  </v-col>
                </v-row>
                <v-row no-gutters>
                  <v-col cols="4"><div>Organization</div></v-col>
                  <v-col>
                    <span class="font-weight-medium" data-cy="popup-organization">
                      {{ selectedEvent.organization | orgNameFromSlug }}
                    </span>
                  </v-col>
                </v-row>
                <v-row no-gutters v-if="showAccountDisplay(selectedEvent)">
                  <v-col cols="4"><div>Exp Code/ PO</div></v-col>
                  <v-col>
                    <span class="font-weight-medium" data-cy="popup-expense-code">
                      {{ getAccountDisplay(selectedEvent) }}
                    </span>
                  </v-col>
                </v-row>
                <v-row no-gutters>
                  <v-col cols="4"><div>Time</div></v-col>
                  <v-col>
                    <div>
                      <span class="font-weight-medium" data-cy="popup-start-date">
                        {{ selectedEvent.startDateAsMoment.format('M/DD/YYYY h:mm A') }}
                      </span>
                      &nbsp;to
                    </div>
                    <span class="font-weight-medium" data-cy="popup-end-date">
                      {{ selectedEvent.endDateAsMoment.format('M/DD/YYYY h:mm A') }}
                    </span>
                  </v-col>
                </v-row>
                <v-row no-gutters v-if="selectedEvent.reservation.attendants.length">
                  <v-col cols="4"><div>Attendants</div></v-col>
                  <v-col>
                    <span
                      class="font-weight-medium"
                      v-for="attendant in selectedEvent.reservation.attendants"
                      :key="attendant.id"
                      :data-cy="`popup-attendant-${attendant.id}`"
                    >
                      <v-chip color="transparent mr-2" class="badge-adjust">
                        <v-icon :color="$api.reservation.getUserIconColor(attendant)" class="mr-2">
                          {{ $api.reservation.getUserIcon() }}
                        </v-icon>
                        {{ attendant.fullName }}
                      </v-chip>
                    </span>
                  </v-col>
                </v-row>
                <div
                  v-if="$api.reservation.useSpecialMsg(selectedEvent.product, selectedEvent.reservation.attendants)"
                  class="mt-2 red--text"
                  data-cy="popup-special-message"
                >
                  {{ $api.reservation.getSpecialMessage() }}
                </div>
                <div v-if="selectedEvent.cancelled" class="mt-2 red--text" data-cy="popup-cancelled">
                  This reservation is cancelled.
                </div>
                <v-row no-gutters v-if="selectedEvent.reservation.comment" class="mt-3">
                  <v-col cols="4"><div>Comments</div></v-col>
                  <v-col data-cy="popup-comment">{{ selectedEvent.reservation.comment }}</v-col>
                </v-row>
                <v-row no-gutters v-if="useMaintenance && selectedEvent.reservation.isMaintenance" class="mt-3">
                  <v-col data-cy="popup-unavailable">This time slot is marked Unavailable</v-col>
                </v-row>
                <v-row no-gutters v-if="useTrial && selectedEvent.reservation.trial" class="mt-3">
                  <v-col data-cy="popup-trial">
                    {{
                      `This is a${selectedEvent.reservation.approved ? '' : 'n unapproved'} Testing / Pilot reservation`
                    }}
                  </v-col>
                </v-row>
              </v-card-text>
              <v-card-actions class="d-flex justify-end">
                <v-btn
                  text
                  color="secondary"
                  v-if="canDeleteReservation(selectedEvent)"
                  @click="deleteReservation(selectedEvent)"
                  data-cy="popup-delete-btn"
                >
                  Delete Reservation
                </v-btn>
                <v-spacer></v-spacer>
                <v-btn
                  color="secondary"
                  v-if="canCancelReservation(selectedEvent)"
                  text
                  @click="cancelReservation(selectedEvent)"
                  class="ml-2"
                  data-cy="popup-cancel-btn"
                >
                  Cancel Reservation
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-menu>
        </v-sheet>
      </v-col>
    </v-row>
  </div>
</template>
<style scoped lang="scss">
.menu-background {
  background-color: #fff;
}
.col {
  padding-top: 0;
  padding-bottom: 0;
}
.dense-checkbox {
  margin-top: 0;
  padding-top: 0;
}
.text-divider {
  display: flex;
  align-items: center;
  letter-spacing: 0.1em;
  --text-divider-gap: 1rem;

  &::before,
  &::after {
    content: '';
    height: 1px;
    background-color: silver;
    flex-grow: 1;
  }

  &::before {
    margin-right: var(--text-divider-gap);
  }

  &::after {
    margin-left: var(--text-divider-gap);
  }
}
.in-the-past {
  opacity: 0.6;
}

.badge-adjust {
  padding: 0;
  padding-left: 4px;
  margin-left: -4px;
}

.icon-tweak {
  margin-bottom: 2px;
}

.v-current-time {
  height: 2px;
  background-color: #ea4335;
  position: absolute;
  left: -1px;
  right: 0;
  pointer-events: none;

  &.first::before {
    content: '';
    position: absolute;
    background-color: #ea4335;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    margin-top: -5px;
    margin-left: -6.5px;
  }
}
.textarea-scroll {
  max-height: 123px;
  overflow-y: auto;
}
</style>
<style lang="scss">
.v-calendar .v-event,
.v-calendar .v-event-more {
  padding-left: 0 !important;
  margin-left: 4px;
}
.v-calendar .v-event,
.v-calendar .v-event-timed {
  min-height: 10px;
  transition: all 0.3s ease-in-out;
  &:hover {
    min-height: 60px !important;
    min-width: 100% !important;
    left: 0 !important;
    margin-left: 0;
  }
}
.theme--light.v-calendar-weekly {
  .v-calendar-weekly__head-weekday[role='columnheader'] {
    &.v-past {
      color: #767676;
      &.v-outside {
        color: #717171;
      }
    }
    &.v-present {
      &.primary--text {
        color: #1f80a1 !important;
      }
    }
  }
}
.theme--light.v-calendar-daily {
  .v-calendar-daily_head-day {
    &.v-past {
      .v-calendar-daily_head-weekday {
        color: #767676 !important;
      }
    }
    &.v-present {
      .v-calendar-daily_head-weekday.primary--text {
        color: #1f80a1 !important;
      }
    }
  }
}
</style>
