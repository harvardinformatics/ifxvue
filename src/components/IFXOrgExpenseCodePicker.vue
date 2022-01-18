<script>
import { mapActions } from 'vuex'

import IFXExpenseCodeRequest from './account/IFXExpenseCodeRequest'

export default {
  name: 'IFXOrgExpenseCodePicker',
  props: {
    user: {
      type: Object,
      required: true,
    },
    isEditing: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      users: [],
      allOrganizations: [],
      showExpenseCodeDialog: false,
      currentUserRecord: {},
      expenses: [],
    }
  },
  components: {
    IFXExpenseCodeRequest,
  },
  mounted() {
    this.getSetData()
  },
  methods: {
    ...mapActions(['showMessage']),
    async getSetData() {
      this.allOrganizations = await this.$api.organization.getList()

      if (this.isEditing) {
        this.currentUserRecord = this.users.find((user) => user.id === this.item.requestor.id)
        this.findBestAccount()
      } else {
        this.currentUserRecord = await this.$api.auth
          .getCurrentUserRecord()
          .catch(() => this.showMessage('Could not get user record. '))

        this.updateOrg()
      }
    },
    requestExpenseCode() {
      this.showExpenseCodeDialog = true
    },
    closeDialog(msg) {
      this.showMessage(msg)
      this.showExpenseCodeDialog = false
    },
    updateUser() {
      this.currentUserRecord = this.users.find((user) => user.id === this.item.requestor.id)
      this.updateOrg()
    },
    updateOrg() {
      const primaryOrg = this.allOrganizations.find((org) => org.slug === this.currentUserRecord.primaryAffiliation)
      this.item.organization = primaryOrg.slug
      this.findBestAccount()
    },
    findBestAccount() {
      // Iterate through accounts, first product, then user, to find one that
      // matches this org. If found, that is the account to use.
      this.expenses.splice(0)
      if (this.currentUserRecord.productAccounts?.length) {
        const match = this.findExpenseCode(this.currentUserRecord.productAccounts, 'User Product')
        if (match) {
          this.expenses.push(match)
        }
      }
      if (!this.expenses.length) {
        // No product account was found for this org. Try regular accounts
        const match = this.findExpenseCode(this.currentUserRecord.accounts, 'User')
        if (match) {
          // Only one user account is allowed and it's always 100%
          match.percent = 100
          this.expenses.push(match)
        }
      }
    },
    findExpenseCode(accounts, accountTypeString) {
      const matchingAccounts = accounts.filter((account) => {
        let isAMatch = account.account.organization === this.item.organization && account.account.active && account.isValid
        if (isAMatch && accountTypeString === 'User Product') {
          isAMatch = isAMatch && account.product.name === this.item.product
        }
        return isAMatch
      })
      if (matchingAccounts.length > 1) {
        this.showMessage(`${matchingAccounts.length} ${accountTypeString} accounts found!`)
        return null
      }
      if (matchingAccounts.length === 0) {
        return null
      }
      return matchingAccounts[0]
    },
  },
  computed: {
    isExpenseButtonDisabled() {
      return !(this.item.organization && this.fullOrgInfo?.name)
    },
    filteredOrgs() {
      return this.allOrganizations.filter((org) => {
        if (this.$api.auth.can('set-any-organization')) {
          return true
        }
        if (org.slug === this.currentUserRecord.primaryAffiliation) {
          return true
        }
        return this.currentUserRecord.affiliations?.some(
          (affiliation) => org.slug === affiliation.organization && affiliation.active
        )
      })
    },
    fullOrgInfo() {
      if (this.item.organization) {
        return this.allOrganizations.find((org) => org.slug === this.item.organization)
      }
      return {}
    },
  },
  watch: {
    user: function (val, prevVal) {
      if (val === prevVal) {
        return
      }
      this.updateUser()
    },
  },
}
</script>

<template>
  <v-container v-if="!isLoading">
    <v-row>
      <v-col cols="12" sm="6">
        <v-select
          :items="filteredOrgs"
          item-text="name"
          item-value="slug"
          v-model="item.organization"
          label="Lab / Organization *"
          data-cy="organization"
          hint="Lab or organization that will be billed.  If you do not see the appropriate organization, please contact the facility administrator."
          prepend-icon="mdi-account-group"
          @focus="clearError('organization')"
          :error-messages="errors.organization"
          @change="findBestAccount"
          persistent-hint
        ></v-select>
      </v-col>
    </v-row>
    <v-row class="align-center">
      <v-col cols="1">
        <span class="expense-title">Billing</span>
      </v-col>
      <v-col>
        <div v-if="expenses && expenses.length" class="d-flex flex-column">
          <div
            v-for="(expense, i) in expenses"
            :key="`expense-code-${i}`"
            class="expense-code-row d-flex flex-row justify-space-between"
          >
            <v-text-field
              style="margin-right: 1em;"
              readonly
              disabled
              label="Expense Code"
              data-cy="expenseCode"
              v-model="expense.account.slug"
              :rules="formRules.generic"
              class="flex-grow-1"
            ></v-text-field>
            <v-text-field
              style="max-width: 120px"
              class="flex-shrink-1"
              readonly
              disabled
              label="Percentage"
              data-cy="percent"
              v-model.number="expense.percent"
              :error-messages="errors.percent"
              @focus="clearError('percent')"
              type="number"
              :rules="formRules.positiveNumber"
            ></v-text-field>
          </div>
        </div>
        <div v-else class="pt-2 pb-3 text-body-1 font-weight-medium grey--text">
          No valid, active expense code available for {{ item.organization | orgName }}.
          <br />
          Select another lab / organization or request a new code.
          <span class="red--text">{{ errors.percent }}</span>
        </div>
      </v-col>
    </v-row>
    <IFXExpenseCodeRequest
      v-if="showExpenseCodeDialog"
      facilityName="Helium Recovery Service"
      :product="item.product"
      :user="currentUserRecord"
      :organization="fullOrgInfo"
      :isActive="showExpenseCodeDialog"
      @close="closeDialog"
      @cancel="showExpenseCodeDialog = false"
      @error="showMessage"
    ></IFXExpenseCodeRequest>
  </v-container>
</template>
<style lang="css">
.expense-title {
  display: inline-block;
  margin-right: 0.5rem;
}
</style>
