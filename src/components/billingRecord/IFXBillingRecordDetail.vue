<script>
import { mapActions } from 'vuex'
import cloneDeep from 'lodash/cloneDeep'

import IFXItemDetailMixin from '@/components/item/IFXItemDetailMixin'
import IFXBillingRecordMixin from '@/components/billingRecord/IFXBillingRecordMixin'

export default {
  name: 'IFXBillingRecordDetail',
  components: {},
  mixins: [IFXBillingRecordMixin, IFXItemDetailMixin],
  filters: {
    transactionDisplay(txn) {
      return `${txn.description}`
    },
  },
  props: {
    facilityId: {
      type: String,
      required: true,
    },
    showEditButtons: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  async created() {
    this.isLoading = true
    this.currentUserRecord = await this.$api.auth
      .getCurrentUserRecord()
      .catch(() => this.showMessage('Could not get user record. '))
  },
  data() {
    return {
      message: '',
      messageType: 'info',
      updating: false,
      errors: [],
      isValid: false,
      isValidEdit: false,
      dialog: false,
      editDialog: false,
      stateOpen: false,
      selected: [],
      facility: {},
      editedItem: {
        rate: 0,
        charge: 0,
        description: null,
        author: {},
      },
      defaultItem: {
        rate: 0,
        charge: 0,
        description: '',
        author: {},
      },
      stateHeaders: [
        { text: 'ID', value: 'id', sortable: true, hide: false },
        { text: 'name', value: 'name', sortable: true },
        { text: 'User', value: 'user', sortable: true },
        { text: 'Comment', value: 'comment', sortable: false },
        { text: 'Updated', value: 'updated', sortable: true },
      ],
      newExpenseCode: {},
      expenseCodes: [],
      currentUserRecord: {},
    }
  },
  computed: {
    headers() {
      const headers = [
        { text: 'ID', value: 'id', sortable: true, hide: true },
        { text: 'Charge', value: 'charge', sortable: true, width: '100px', namedSlot: true },
        { text: 'Rate', value: 'rate', sortable: true },
        { text: 'User', value: 'author.full_name', sortable: true },
        { text: 'Description', value: 'description', sortable: true },
      ]
      return headers.filter((h) => !h.hide || !this.$vuetify.breakpoint[h.hide])
    },
    hasMultipleTransactions() {
      return this.item.billingRecordStates.length > 1
    },
  },
  methods: {
    ...mapActions(['showMessage']),
    async init() {
      try {
        this.facility = await this.$api.facility.getByID(this.facilityId)
        this.item = await this.apiRef.getByID(this.facility.invoicePrefix, this.id)
      } catch (error) {
        const errorMessage = this.getErrorMessage(error)
        this.messageType = 'error'
        this.message = `Error loading ${this.facility.name} billing record: ${errorMessage}`
        this.showMessage(this.message)
      }
    },

    getErrorMessage(error) {
      // Regular showMessage is not getting the response data properly
      let message = 'Unknown error'
      if (error) {
        if (
          error.hasOwnProperty('response')
          && error.response
          && error.response.hasOwnProperty('data')
          && error.response.data
        ) {
          message = Object.values(error.response.data).join('\n')
        } else {
          message = error
        }
      }
      return message
    },
    closeTxnDialog() {
      this.dialog = false
    },
    openTxnDialog(item) {
      this.editedItem = { ...this.defaultItem }
      this.editedItem.rate = item.rate
      this.editedItem.author = { ...this.$api.authUser }
      this.$nextTick(() => {
        this.dialog = true
      })
    },
    async openEditDialog() {
      this.expenseCodes = await this.$api.account.getList()
      this.newExpenseCode = this.$api.account.create(this.item.account)
      this.editDialog = true
    },
    closeEditDialog() {
      this.editDialog = false
    },
    updateRecord() {
      const newBillingRec = cloneDeep(this.item)
      newBillingRec.account = this.newExpenseCode.data

      this.updateBillingRecord(newBillingRec)
      this.closeEditDialog()
    },
    addNewTransaction(item) {
      const orgBillingRec = cloneDeep(this.item)
      const { charge, rate, description, author } = item
      const newTransactionData = {
        charge,
        rate,
        description,
        author,
      }
      const newTransaction = this.$api.billingTransaction.create(newTransactionData)
      orgBillingRec.addTransaction(newTransaction)
      this.updateBillingRecord(orgBillingRec)
      this.dialog = false
    },
    updateBillingRecord(newRecord) {
      this.updating = true
      this.$api.billingRecord
        .bulkUpdate([newRecord], this.facility.applicationUsername)
        .then((response) => {
          this.showMessage('Successfully updated billing record')
          this.item = this.$api.billingRecord.create(response.data[0])
          this.updating = false
        })
        .catch((error) => {
          console.log(error)
          const message = this.getErrorMessage(error)
          this.showMessage(message)
          this.updating = false
        })
    },
    toggleState() {
      this.stateOpen = !this.stateOpen
    },
    getOrgName(item) {
      return item.account ? this.$api.organization.parseSlug(item.account.organization).name : ''
    },
    canEdit() {
      return this.showEditButtons && this.item.currentState !== 'FINAL'
    },
    canAddTransaction() {
      return this.showEditButtons && this.item.currentState !== 'FINAL'
    },
  },
  watch: {},
}
</script>
<template>
  <!-- eslint-disable vue/valid-v-slot -->
  <v-container v-if="!isLoading">
    <IFXPageHeader>
      <template #title>Billing Record {{ item.id }}</template>
      <template #actions>
        <IFXButton v-if="canEdit()" btnType="edit" xSmall @action="openEditDialog()" />
      </template>
    </IFXPageHeader>
    <v-container px-5 py-0>
      <v-progress-linear indeterminate v-if="updating"></v-progress-linear>
      <v-row justify="start" align="center" dense>
        <v-col sm="2">
          <h3>Organization</h3>
        </v-col>
        <v-col v-if="item.account">
          {{ getOrgName(item) }}
        </v-col>
      </v-row>
      <v-row justify="start" align="center" dense>
        <v-col sm="2">
          <h3>Facility</h3>
        </v-col>
        <v-col>
          {{ facility.name }}
        </v-col>
      </v-row>
      <v-row justify="start" align="center" dense>
        <v-col sm="2">
          <h3>Product</h3>
        </v-col>
        <v-col>
          {{ item.productUsage.product }}
        </v-col>
      </v-row>
      <v-row justify="start" align="center" dense>
        <v-col sm="2">
          <h3>Charge</h3>
        </v-col>
        <v-col>
          {{ item.decimalCharge | dollars }}
        </v-col>
      </v-row>
      <v-row justify="start" align="center" dense>
        <v-col sm="2">
          <h3>{{ item.account.account_type }}</h3>
        </v-col>
        <v-col>
          <span>{{ item.account.slug }}</span>
          <span class="ml-2 text-body-1 green--text text--darken-1" v-if="item.account.active">
            &check;&nbsp;Active
          </span>
          <span class="ml-2 text-body-1 red--text" v-else>&cross;&nbsp;Inactive</span>
        </v-col>
      </v-row>
      <v-row justify="start" align="center" dense>
        <v-col sm="2">
          <h3>Billing year</h3>
        </v-col>
        <v-col>
          {{ item.year }}
        </v-col>
      </v-row>
      <v-row justify="start" align="center" dense>
        <v-col sm="2">
          <h3>Billing month</h3>
        </v-col>
        <v-col>
          {{ item.month }}
        </v-col>
      </v-row>
      <v-row justify="start" align="center" dense>
        <v-col sm="2">
          <h3>Start date</h3>
        </v-col>
        <v-col>
          {{ item.startDate | humanDatetime }}
        </v-col>
      </v-row>
      <v-row v-if="item.endDate" justify="start" align="center" dense>
        <v-col sm="2">
          <h3>End date</h3>
        </v-col>
        <v-col>
          {{ item.endDate | humanDatetime }}
        </v-col>
      </v-row>
      <v-row justify="start" align="center" dense>
        <v-col sm="2">
          <h3>Description</h3>
        </v-col>
        <v-col>
          {{ item.description }}
        </v-col>
      </v-row>
      <v-row v-if="item.productUsageLinkText" justify="start" align="center" dense>
        <v-col sm="2">
          <h3>Usage</h3>
        </v-col>
        <v-col>
          <a :href="item.productUsageUrl">{{ item.productUsageLinkText }}</a>
        </v-col>
      </v-row>
      <v-row justify="start" align="center" dense>
        <v-col sm="2">
          <h3>State</h3>
        </v-col>
        <v-btn icon small @click="toggleState" class="expand-icon" v-if="hasMultipleTransactions">
          <v-icon :class="{ active: stateOpen }">mdi-menu-right</v-icon>
        </v-btn>
        <span class="ml-1">{{ item.currentState }}</span>
      </v-row>
      <v-row v-if="stateOpen">
        <v-col sm="2">
          <h3>State History</h3>
        </v-col>
        <v-col>
          <v-data-table
            :headers="stateHeaders"
            :items="item.billingRecordStates"
            :items-per-page="-1"
            hide-default-footer
          >
            <template v-slot:item.updated="{ item }">
              {{ item.updated | humanDatetime }}
            </template>
          </v-data-table>
        </v-col>
      </v-row>
      <v-row justify="start" align="center" dense>
        <v-col sm="2">
          <h3>Updated</h3>
        </v-col>
        <v-col>
          {{ item.updated | humanDatetime }}
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <div class="d-flex justify-space-between">
            <h3>Transactions</h3>
            <IFXButton v-if="canAddTransaction()" iconString="add" btnType="add" xSmall @action="openTxnDialog(item)" />
          </div>
        </v-col>
      </v-row>
      <v-row>
        <v-col offset="2">
          <v-data-table
            v-if="item.transactions && item.transactions.length"
            :items="item.transactions"
            :headers="headers"
            hide-default-footer
            :items-per-page="-1"
          >
            <template v-slot:item.charge="{ item }">
              <span>
                {{ item.decimalCharge | dollars }}
              </span>
            </template>
            <template v-slot:item.rate="{ item }">
              {{ item.rate }}
            </template>
          </v-data-table>
          <span v-else>None</span>
        </v-col>
        <v-dialog v-model="dialog" max-width="600px">
          <v-card>
            <v-card-title>
              <span class="text-h5">Add a new transaction to Billing Record {{ item.id }}</span>
            </v-card-title>
            <v-card-subtitle>
              <div class="py-2 text-h6 font-weight-medium">Rate is {{ editedItem.rate }}</div>
            </v-card-subtitle>
            <v-card-text>
              <v-form v-model="isValid">
                <v-row>
                  <v-col>
                    <v-currency-field
                      required
                      v-model="editedItem.charge"
                      label="Charge"
                      :error-messages="errors[editedItem.charge]"
                      :rules="formRules.currency"
                      prefix="$"
                      allow-negative
                    ></v-currency-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12">
                    <v-textarea
                      required
                      v-model="editedItem.description"
                      label="Transaction description"
                      :error-messages="errors[editedItem.description]"
                      :rules="formRules.generic"
                    ></v-textarea>
                  </v-col>
                </v-row>
              </v-form>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="secondary" text @click="closeTxnDialog">Cancel</v-btn>
              <v-btn color="blue darken-1" text :disabled="!isValid" @click="addNewTransaction(editedItem)">Save</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="editDialog" max-width="600px">
          <v-card>
            <v-card-title>
              <span class="text-h5">Edit Billing Record {{ item.id }}</span>
            </v-card-title>
            <v-card-text>
              <v-form v-model="isValidEdit">
                <v-row>
                  <v-col>
                    <v-autocomplete
                      required
                      v-model="newExpenseCode"
                      :items="expenseCodes"
                      item-text="slug"
                      item-value="slug"
                      label="Expense Code / PO"
                      :error-messages="errors[newExpenseCode]"
                      :rules="formRules.generic"
                      return-object
                    ></v-autocomplete>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12">
                    <v-textarea
                      required
                      v-model="item.description"
                      label="Billing Record description"
                      :error-messages="errors[item.description]"
                      :rules="formRules.generic"
                      disabled
                    ></v-textarea>
                  </v-col>
                </v-row>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="secondary" text @click="closeEditDialog">Cancel</v-btn>
              <v-btn color="blue darken-1" text :disabled="!isValidEdit" @click="updateRecord">Save</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-row>
    </v-container>
  </v-container>
</template>
<style scoped lang="scss">
.message-text {
  font-size: smaller;
  font-style: italic;
  color: red;
}
.state-display {
  font-size: smaller;
}
.expand-icon {
  transition: rotate 0.3s ease-in-out;

  .active {
    -webkit-transform: rotate(90deg);
    transform: rotate(90deg);
  }
}
</style>
