<script>
import { mapActions } from 'vuex'
import moment from 'moment-timezone'
import IFXItemCreateEditMixin from '@/components/item/IFXItemCreateEditMixin'
import IFXProductUsageMixin from '@/components/productUsage/IFXProductUsageMixin'
import IFXPageActionBar from '@/components/page/IFXPageActionBar'

export default {
  name: 'IFXProductCreateEdit',
  mixins: [IFXProductUsageMixin, IFXItemCreateEditMixin],
  components: {
    IFXPageActionBar,
  },
  props: {
    productCategory: {
      type: String,
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
      duration: [
        { value: 30, text: '30 minutes' },
        { value: 60, text: '1 hour' },
        { value: 90, text: '90 minutes' },
        { value: 120, text: '2 hours' },
        { value: 180, text: '3 hours' },
        { value: 240, text: '4 hours' },
      ],
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
      if (!product) {
        this.item = this.$api.productUsage.create({})
        return
      }
      this.item.product = product.productName
      this.item.description = product.productDescription
      const currentUser = this.allUsers.find((u) => u.id === parseInt(this.$api.authUser.id, 10))
      this.item.loggedBy = this.$api.user.decompose(currentUser)
      // Set a default start date/time of now
      this.item.startDate = moment.tz('America/New_York').toISOString()
      // Get the units from the product rate
      this.item.units = product.rates[0]?.units ? product.rates[0].units : 'ea'
    },
    // minDate() {
    //   return new Date().toISOString()
    // },
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
          .isAfter(moment.tz(this.item.startDate, 'America/New_York')) || 'Usage end must be after start'
      )
    },
    checkIsBeforeEnd(v) {
      if (this.item.endDate) {
        return (
          moment
            .tz(v, this.parseFormats, 'America/New_York')
            .isBefore(moment.tz(this.item.endDate, 'America/New_York')) || 'Usage start must be before end'
        )
      }
      return true
    },
    // checkInPast(v) {
    //   return (
    //     moment.tz(v, this.parseFormats, 'America/New_York').isAfter(moment.tz('America/New_York'))
    //     || this.$api.auth.can('add-usages-in-the-past')
    //     || 'Cannot set usages in the past'
    //   )
    // },
    openPickers(type = 'startDate') {
      let theDateTime
      if (type === 'startDate' && this.item.startDate) {
        theDateTime = moment.tz(this.item.startDate, 'America/New_York')
      } else if (type === 'endDate' && this.item.endDate) {
        theDateTime = moment.tz(this.item.endDate, 'America/New_York')
      } else {
        theDateTime = moment.tz('America/New_York')
      }
      this.pickerDate = theDateTime.format('YYYY-MM-DD')
      this.pickerTime = theDateTime.format('HH:MM')
      if (type === 'endDate') {
        this.endDateMenu = true
      } else {
        this.startDateMenu = true
      }
    },
    updateDate(value, type = 'startDate') {
      const theDateTime = moment.tz(value, this.parseFormats, 'America/New_York')
      this.item[type] = theDateTime.toISOString()
      if (type === 'startDate' && this.durationValue) {
        this.setEndTime(this.durationValue, false)
      } else {
        this.revalidateTimes()
      }
      this.startDateMenu = false
      this.endDateMenu = false
    },
    addValuesFromDatepicker(type = 'startDate', pickerDate, pickerTime) {
      const dateObject = moment.tz(`${pickerDate}T${pickerTime}:00`, 'America/New_York')
      const newValue = dateObject.toISOString()
      this.item[type] = newValue
      if (type === 'startDate' && this.durationValue) {
        this.setEndTime(this.durationValue, false)
      }
      this.startDateMenu = false
      this.endDateMenu = false
    },
    revalidateTimes() {
      this.$refs.startDate.validate(true)
      this.$refs.endDate.validate(true)
    },
    setEndTime(value, validate = true) {
      this.item.endDate = moment.tz(this.item.startDate, 'America/New_York').add(value, 'minutes').toISOString()
      if (validate) {
        this.revalidateTimes()
      }
    },
    pluralize(count, string) {
      return `${count} ${string}${count === 1 ? '' : 's'}`
    },
  },
  computed: {
    title() {
      const itemTitle = this.splitOnCapitals(this.itemType).join(' ')
      if (this.isEditing) {
        return `Edit ${itemTitle} for ${this.item.product}`
      }
      return `Create ${itemTitle} ${this.item.product ? `for ${this.item.product}` : ''}`
    },
    humanStartDate() {
      return this.item.startDate ? moment(this.item.startDate).format('M/DD/YYYY h:mm A') : ''
    },
    humanEndDate() {
      return this.item.endDate ? moment(this.item.endDate).format('M/DD/YYYY h:mm A') : ''
    },
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
        <v-row>
          <v-col>
            <v-autocomplete
              v-model="item.product"
              :items="filteredProducts"
              item-text="productName"
              label="Product"
              :rules="formRules.generic"
              data-cy="product"
              :error-messages="errors.product_number"
              class="required"
              required
              clearable
              return-object
              clear-icon="mdi-close-circle"
              @change="setProductWithObject($event)"
              @focus="clearAllErrors()"
            ></v-autocomplete>
          </v-col>
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
        </v-row>
        <v-row>
          <v-col>
            <v-autocomplete
              v-model="item.productUser"
              :items="allUsers"
              item-text="fullName"
              item-value="fullName"
              label="Product User"
              :rules="formRules.generic"
              data-cy="product-user"
              :error-messages="errors.product_user"
              class="required"
              required
              return-object
              clearable
              clear-icon="mdi-close-circle"
              @focus="clearAllErrors()"
            ></v-autocomplete>
          </v-col>
          <v-col>
            <v-autocomplete
              v-model="item.loggedBy"
              :items="allUsers"
              item-text="fullName"
              item-value="fullName"
              label="Logged By"
              :rules="formRules.generic"
              data-cy="logged-by"
              :error-messages="errors.logged_by"
              class="required"
              required
              return-object
              clearable
              clear-icon="mdi-close-circle"
              @focus="clearAllErrors()"
            ></v-autocomplete>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-row>
              <v-col>
                <v-text-field
                  ref="startDate"
                  class="startDate required"
                  :value="humanStartDate"
                  @change="updateDate($event, 'startDate')"
                  label="Start Date and Time"
                  prepend-icon="mdi-calendar"
                  required
                  hint="MM/DD/YYYY HH:MM AM/PM (all times Eastern)"
                  persistent-hint
                  @click:prepend.stop="openPickers()"
                  :rules="[dateTimeRule]"
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
                </v-dialog>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-text-field
                  v-model.number="item.decimalQuantity"
                  class="required"
                  type="number"
                  label="Quantity"
                  :rules="formRules.generic"
                  data-cy="quantity"
                  :hint="`Enter the quantity used in ${item.units}`"
                  persistent-hint
                  :error-messages="errors.quantity"
                  @focus="clearError('quantity')"
                  required
                ></v-text-field>
              </v-col>
            </v-row>
          </v-col>
          <v-col>
            <v-row>
              <v-col>
                <v-autocomplete
                  label="Length of usage"
                  v-model="durationValue"
                  :items="duration"
                  @change="setEndTime($event, true)"
                  class="my-2"
                  data-cy="length-select"
                ></v-autocomplete>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <div class="text-divider font-italic text-center">Or set End Date/Time directly</div>
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
                :rules="[dateTimeRule, checkIsAfterStart]"
                data-cy="end-date"
              ></v-text-field>
              <v-dialog v-model="endDateMenu" v-if="endDateMenu" max-width="670px">
                <div class="d-flex flex-row menu-background">
                  <div class="d-flow flow-column">
                    <v-date-picker v-model="pickerDate" no-title scrollable show-adjacent-months></v-date-picker>
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
              </v-dialog>
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
</style>
