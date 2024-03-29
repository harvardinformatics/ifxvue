<script>
import IFXAccountMixin from '@/components/account/IFXAccountMixin'
import IFXItemDetailMixin from '@/components/item/IFXItemDetailMixin'
import IFXItemHistoryDisplay from '@/components/item/IFXItemHistoryDisplay'

export default {
  name: 'AccountDetail',
  mixins: [IFXItemDetailMixin, IFXAccountMixin],
  components: {
    IFXItemHistoryDisplay,
  },
  data() {
    return {
      showInvalidAuthorizations: false,
    }
  },
  computed: {
    detailTitle() {
      if (!this.item.accountType) {
        return 'Expense Code / PO'
      }
      return this.item.accountType
    },
  },
}
</script>
<template>
  <v-container v-if="!isLoading">
    <IFXPageHeader>
      <template #title>{{ detailTitle }}</template>
      <template #id>&nbsp;"{{ item.name }}"</template>
      <template #actions>
        <span v-if="item.active" class="active-account d-flex align-center">
          <v-icon color="success">check</v-icon>
          <span>Currently Active</span>
        </span>
        <span v-else class="inactive-account d-flex align-center">
          <v-icon>close</v-icon>
          <span>Currently Inactive</span>
        </span>
      </template>
      <template #content>
        <IFXItemHistoryDisplay :item="item" />
      </template>
    </IFXPageHeader>
    <v-container px-5 py-0>
      <v-row justify="start" align="center" dense>
        <v-col sm="2">
          <h3>Code</h3>
        </v-col>
        <v-col>
          {{ item.code }}
        </v-col>
      </v-row>
      <v-row justify="start" align="center" dense>
        <v-col sm="2">
          <h3>Organization</h3>
        </v-col>
        <v-col>
          {{ item.organization }}
        </v-col>
      </v-row>
      <v-row justify="start" align="center" dense>
        <v-col sm="2">
          <h3>Valid From</h3>
        </v-col>
        <v-col>
          {{ item.validFrom | columnDate }}
        </v-col>
      </v-row>
      <v-row justify="start" align="center" dense>
        <v-col sm="2">
          <h3>Expiration Date</h3>
        </v-col>
        <v-col>
          <span v-if="item.expirationDate">
            {{ item.expirationDate | columnDate }}
          </span>
          <span v-else>None</span>
        </v-col>
      </v-row>
      <v-row justify="start" align="start" dense>
        <v-col sm="2">
          <h3>Authorizations</h3>
          <div class="invalid" style="margin: 0.5em; font-size: smaller">
            Italics indicates currently inactive authorizations
          </div>
        </v-col>
        <v-col>
          <v-row dense v-for="userAccount in item.userAccounts" :key="userAccount.id">
            <v-col>
              <span :class="userAccount.isValid ? 'valid' : 'invalid'">
                {{ userAccount.user.fullName }} for any facility product
              </span>
            </v-col>
          </v-row>
          <v-row dense v-for="userProductAccount in item.userProductAccounts" :key="userProductAccount.id">
            <v-col>
              <span :class="userProductAccount.isValid ? 'valid' : 'invalid'">
                {{ userProductAccount.user.fullName }} for {{ userProductAccount.product }}
                <span v-if="userProductAccount.percent !== 100">({{ userProductAccount.percent }}%)</span>
              </span>
            </v-col>
          </v-row>
        </v-col>
        <v-spacer></v-spacer>
      </v-row>
    </v-container>
  </v-container>
</template>

<style scoped>
.data-item {
  padding-top: 1px;
  padding-bottom: 1px;
}
.active-account {
  color: green;
  font-style: italic;
}
.inactive-account {
  color: red;
  font-style: italic;
}
.invalid {
  color: grey;
  font-style: italic;
}
</style>
