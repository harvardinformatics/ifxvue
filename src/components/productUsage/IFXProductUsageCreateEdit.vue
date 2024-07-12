<script>
import { mapActions } from 'vuex'
import moment from 'moment-timezone'
import IFXItemCreateEditMixin from '@/components/item/IFXItemCreateEditMixin'
import IFXItemSelectList from '@/components/item/IFXItemSelectList'
import IFXProductUsageMixin from '@/components/productUsage/IFXProductUsageMixin'
import IFXPageActionBar from '@/components/page/IFXPageActionBar'
import IFXItemDataTable from '@/components/item/IFXItemDataTable'

export default {
  name: 'IFXProductCreateEdit',
  mixins: [IFXProductUsageMixin, IFXItemCreateEditMixin],
  components: {
    IFXItemSelectList,
    IFXPageActionBar,
    IFXItemDataTable,
  },
  props: {
    productCategory: {
      type: Array,
      required: false,
    },
    id: {
      default: '',
      type: String,
    },
    isEditing: {
      default: false,
      type: Boolean,
    },
    emitNavigate: {
      default: false,
      type: Boolean,
    },
  },
  data() {
    return {
      filteredProducts: [],
      allUsers: [],
      allOrganizations: [],
      pickerDate: '',
      pickerTime: '',
      startDateMenu: false,
      duration: [],
      durationValue: null,
      parseFormats: ['M/DD/YYYY h:mm A', 'M/DD/YYYY h:mmA'],
    }
  },
  methods: {
    ...mapActions(['showMessage']),
    async getAdditionalData() {
      const allProducts = await this.$api.product.getList()
      this.allUsers = await this.$api.user.getList()
      this.allOrganizations = await this.$api.organization.getList()
      this.filteredProducts = allProducts.filter((product) => product.productCategory === this.productCategory)
    },
    setProductWithNumber(productNumber) {
      const product = this.filteredProducts.find((c) => c.productNumber === productNumber)
      if (product) {
        this.setProductWithObject(product)
      }
    },
    setProductWithObject(product) {
      this.selectedProduct = cloneDeep(product)
      const decomposed = this.$api.product.decompose(product.data)
      this.item = this.$api.productUsage.create(decomposed)
      this.item.product = product.productName
      this.item.name = `${product.productName} Usage`
      this.item.description = product.productDescription
      this.loggedBy = cloneDeep(this.$api.authUser)
      // Set a default start date/time of now
      this.item.startDate = moment.tz('America/New_York').toISOString()
    },
    minDate() {
      return new Date().toISOString()
    },
    humanStartDate() {
      return this.startDate ? moment(this.startDate).format('M/DD/YYYY') : ''
    },
    humanEndDate() {
      return this.endDate ? moment(this.endDate).format('M/DD/YYYY') : ''
    },
    revalidateTimes() {
      this.$refs.startDate.validate(true)
      this.$refs.endDate.validate(true)
    },
    setEndTime(value, validate = true) {
      this.item.endDate = moment.tz(this.newEvent.startDate, 'America/New_York').add(value, 'minutes').toISOString()
      if (validate) {
        this.revalidateTimes()
      }
    },
    addValuesFromDatepicker(pickerDate, pickerTime) {
      const dateObject = moment.tz(`${pickerDate}T${pickerTime}:00`, 'America/New_York')
      const newValue = dateObject.toISOString()
      // Force startTime to be reactive
      this.item.startDate = newValue
      this.startDateMenu = false
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
          .isAfter(moment.tz(this.newEvent.startDate, 'America/New_York')) || 'Usage end must be after start'
      )
    },
    checkIsBeforeEnd(v) {
      if (this.newEvent.endDate) {
        return (
          moment
            .tz(v, this.parseFormats, 'America/New_York')
            .isBefore(moment.tz(this.newEvent.endDate, 'America/New_York')) || 'Usage start must be before end'
        )
      }
      return true
    },
    checkInPast(v) {
      return (
        moment.tz(v, this.parseFormats, 'America/New_York').isAfter(moment.tz('America/New_York'))
        || this.$api.auth.can('add-usages-in-the-past')
        || 'Cannot set usages in the past'
      )
    },
    openPickers() {
      if (this.item.startTime) {
        const theDateTime = moment.tz(this.item.startTime, 'America/New_York')
        this.pickerDate = theDateTime.format('YYYY-MM-DD')
        this.pickerTime = theDateTime.format('HH:mm')
      }
      this.startDateMenu = true
    },
    updateDate(value) {
      const theDateTime = moment.tz(value, this.parseFormats, 'America/New_York')
      // Force startTime to be reactive
      this.item.startTime = theDateTime.toISOString()
    },
    priceHint(item) {
      return `Price per ${item.units ? `${item.units}` : 'unit'} in dollars`
    },
    pluralize(count, string) {
      return `${count} ${string}${count === 1 ? '' : 's'}`
    },
  },
  computed: {
    // headers() {
    //   const headers = [
    //     { text: 'Name', value: 'name', sortable: true },
    //     { text: 'Description', value: 'description', sortable: true, namedSlot: true },
    //     { text: 'Price', value: 'price', sortable: true },
    //     { text: 'Units', value: 'units', sortable: true, slot: true },
    //     { text: 'Max Quantity', value: 'maxQty', sortable: false, namedSlot: true },
    //     { text: 'Active', value: 'active', sortable: true, namedSlot: true },
    //     { text: '', value: 'actions', namedSlot: true, sortable: false },
    //   ]
    //   return headers.filter((h) => !h.hide || !this.$vuetify.breakpoint[h.hide])
    // },
    title() {
      const itemTitle = this.splitOnCapitals(this.itemType).join(' ')
      if (this.isEditing) {
        return `Edit ${itemTitle} ${this.item.name}`
      }
      return `Create ${itemTitle}`
    },
    productNotSelected() {
      return !(this.product && Object.keys(this.product).length)
    },
    // filteredRates() {
    //   if (this.item?.rates) {
    //     return this.item.rates.filter((r) => r.originalActive || this.showDeactivatedRates)
    //   }
    //   return []
    // },
  },
}
</script>

<template>
  <v-container v-if="!isLoading">
    <IFXPageHeader>
      <template #title>{{ title }}</template>
      <template #content>{{ description }}</template>
    </IFXPageHeader>
    <v-container>
      <v-form v-model="isValid" ref="productUsageForm">
        <v-row v-if="item.course">
          <v-col>
            <v-alert dismissible type="info">
              <p class="text-body-1">
                {{ isEditing ? 'Editing' : 'Creating' }} a product usage for the
                <strong>{{ item.productName }}</strong>
                product in the
                <strong>{{ item.organization.name }}</strong>
                organization
                <br />
                The usage is
                {{ item.scheduleAsNeeded ? ' scheduled as needed and ' : '' }}
                {{
                  item.billable
                    ? `billable and the rate is ${
                        item.rates.length ? `"${$api.course.getRatesList(item)}"` : 'not set'
                      }`
                    : 'not billable'
                }}.
              </p>
            </v-alert>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-autocomplete
              v-model="item.product"
              :items="filteredProducts"
              item-text="productName"
              item-value="productNumber"
              label="Product"
              :rules="formRules.generic"
              data-cy="product"
              :error-messages="errors.product_number"
              class="required"
              required
              clearable
              return-object
              clear-icon="mdi-close-circle"
              @change="setCourseWithObject($event)"
              @focus="clearAllErrors()"
            ></v-autocomplete>
          </v-col>
        </v-row>
        <v-col>
          <v-autocomplete
            v-model="item.organization"
            :items="allOrganizations"
            item-text="name"
            item-value="slug"
            label="Organization"
            :rules="formRules.generic"
            data-cy="organization"
            :error-messages="errors.organization"
            class="required"
            required
            clearable
            clear-icon="mdi-close-circle"
            @focus="clearAllErrors()"
          ></v-autocomplete>
        </v-col>
        <v-row>
          <v-col>
            <v-autocomplete
              v-model="item.productUser"
              :items="allUsers"
              item-text="allUsers.fullName"
              item-value="allUsers.fullName"
              label="Product User"
              :rules="formRules.generic"
              data-cy="product-user"
              :error-messages="errors.product_user"
              class="required"
              required
              return-object
              multiple
              clearable
              clear-icon="mdi-close-circle"
              @focus="clearAllErrors()"
            ></v-autocomplete>
          </v-col>
          <v-col>
            <v-autocomplete
              v-model="item.loggedBy"
              :items="allUsers"
              item-text="allUsers.fullName"
              item-value="allUsers.fullName"
              label="Logged By"
              :rules="formRules.generic"
              data-cy="logged-by"
              :error-messages="errors.logged_by"
              class="required"
              required
              return-object
              multiple
              clearable
              clear-icon="mdi-close-circle"
              @focus="clearAllErrors()"
            ></v-autocomplete>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-text-field
              ref="startDate"
              class="startDate required"
              :value="humanStartDateTime"
              @change="updateDate($event)"
              label="Start Date and Time"
              prepend-icon="mdi-calendar"
              required
              hint="MM/DD/YYYY HH:MM AM/PM (all times Eastern)"
              persistent-hint
              @click:prepend.stop="openPickers()"
              :rules="[dateTimeRule, checkInPast]"
              :error-messages="errors.start_date"
              data-cy="start-date"
              @focus="clearAllErrors()"
            ></v-text-field>
            <v-dialog v-model="startDateMenu" v-if="startDateMenu" max-width="670px">
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
                      @click="addValuesFromDatepicker(pickerDate, pickerTime)"
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
            </v-dialog>
          </v-col>
          <v-col>
            <v-row>
              <v-col>
                <v-autocomplete
                  label="Length of usage (minutes) *"
                  v-model="durationValue"
                  :items="duration"
                  @change="setEndTime($event, true)"
                  class="my-2"
                  :disabled="productNotSelected"
                  data-cy="length-select"
                >
                  <template #no-data>
                    <div class="mx-3 my-1">No options (you must select a product)</div>
                  </template>
                </v-autocomplete>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <div class="text-divider font-italic text-center">Or set End time directly</div>
              </v-col>
            </v-row>
            <v-row>
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
                :disabled="productNotSelected"
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
            </v-row>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-textarea
              v-model="item.description"
              label="Description"
              data-cy="description"
              :rules="formRules.generic"
              :error-messages="errors.product_description"
              @focus="clearError('product_description')"
              required
              auto-grow
              rows="2"
            ></v-textarea>
          </v-col>
        </v-row>
        <IFXPageActionBar btnType="submit" :disabled="!isSubmittable" @action="submit" :submitting="submitting" />
      </v-form>
    </v-container>
  </v-container>
</template>
<style lang="scss" scoped>
.menu-background {
  background-color: white;
}
.startDate {
  cursor: pointer;
}
</style>
