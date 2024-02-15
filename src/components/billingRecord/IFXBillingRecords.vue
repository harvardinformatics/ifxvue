<script>
import moment from 'moment'
import { mapActions } from 'vuex'
import IFXBillingRecordListDecimal from '@/components/billingRecord/IFXBillingRecordListDecimal'

export default {
  name: 'IFXBillingRecords',
  props: {
    organization: {
      type: String,
      required: false,
      default: null,
    },
    useDefaultMailButton: {
      type: Boolean,
      required: false,
      default: true,
    },
    allowDownloads: {
      type: Boolean,
      required: false,
      default: false,
    },
    showDates: {
      type: Boolean,
      required: false,
      default: false,
    },
    showTotals: {
      type: Boolean,
      required: false,
      default: false,
    },
    totalUnits: {
      type: String,
      required: false,
      default: 'hours',
    },
  },
  data() {
    return {
      facilities: [],
      date: this.getInitialDate(),
      dateMenu: false,
      isLoading: true,
      selected: [],
      items: [],
      itemKey: 'key',
      showBillingRecords: false,
      keyModifier: 1,
      actions: [
        {
          key: 'approve',
          name: 'Approve',
          description: 'approve billing record(s).',
          execute: this.approve,
          condition: (item) => item,
          allowMultiple: true,
        },
      ],
    }
  },
  components: {
    IFXBillingRecordListDecimal,
  },
  methods: {
    ...mapActions(['showMessage']),
    getInitialDate() {
      let initialDate = this.$api.storage.getItem('billingRecordListDate', 'session')
      if (!initialDate) {
        let year = moment().subtract(1, 'months').year()
        let month = moment().subtract(1, 'months').format('MM')
        if (this.$route.query.year && /^[0-9]{4}$/.test(this.$route.query.year.trim())) {
          year = this.$route.query.year.trim()
        }
        if (this.$route.query.month && /^[0-9]+$/.test(this.$route.query.month.trim())) {
          month = this.$route.query.month.trim().padStart(2, '0')
        }
        initialDate = `${year}-${month}`
      }
      return initialDate
    },
    async getFacilities() {
      this.facilities = await this.$api.facility.getList({ application_username: this.$api.vars.appName })
    },
    resetShowBillingRecords() {
      this.showBillingRecords = false
      this.keyModifier += 100
      this.showBillingRecords = true
    },
  },
  watch: {
    date(val) {
      if (val) {
        this.$api.storage.setItem('billingRecordListDate', val, 'session')
      }
    },
  },
  mounted() {
    this.getFacilities()
    this.showBillingRecords = true
    this.isLoading = false
  },
}
</script>
<template>
  <v-card v-if="!isLoading">
    <v-card-title>
      <v-container>
        <v-row class="d-flex align-center">
          <v-col>
            <h2 data-cy="header-title">Billing Records</h2>
          </v-col>
          <v-col cols="4">
            <v-menu
              v-model="dateMenu"
              :close-on-content-click="false"
              :nudge-right="40"
              transition="scale-transition"
              offset-y
              min-width="auto"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="date"
                  label="Month *"
                  prepend-icon="mdi-calendar"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                  hint="YYYY-MM format"
                  persistent-hint
                ></v-text-field>
              </template>
              <v-date-picker v-model="date" type="month" @input="dateMenu = false"></v-date-picker>
            </v-menu>
          </v-col>
          <v-col>
            <v-btn @click="resetShowBillingRecords()">View Billing Records</v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-card-title>
    <v-container v-if="showBillingRecords">
      <v-row v-for="facility in facilities" :key="facility.id + keyModifier">
        <v-col>
          <IFXBillingRecordListDecimal
            :facility="facility"
            :date="date"
            :organization="organization"
            :allowInvoiceGeneration="false"
            :allowApprovals="false"
            :allowDownloads="allowDownloads"
            :useDefaultMailButton="useDefaultMailButton"
            :showDates="showDates"
            :showTotals="showTotals"
            :totalUnits="totalUnits"
          />
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>
