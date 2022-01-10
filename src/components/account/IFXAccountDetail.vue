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
  computed: {
    detailTitle() {
      if (!this.item.accountType) {
        return 'Expense Code / PO'
      }
      return this.item.accountType
    }
  },
}
</script>
<template>
  <v-container v-if="!isLoading">
    <IFXPageHeader>
      <template #title>{{ detailTitle }} </template>
      <template #id>"{{ item.name }}"</template>
      <template #actions>
        <span v-if="item.active" class="active-account">
          <v-icon color="success">check</v-icon> Currently Active
        </span>
        <span v-else class="inactive-account">
          <v-icon>close</v-icon>Currently Inactive
        </span>
      </template>
      <template #content>
        <IFXItemHistoryDisplay :item="item" />
      </template>
    </IFXPageHeader>
    <v-container px-5 py-0>
      <v-row justify="start" align="center" dense>
        <v-col sm="3">
          <h3>Code</h3>
        </v-col>
        <v-col>
          {{ item.code }}
        </v-col>
      </v-row>
      <v-row justify="start" align="center" dense>
        <v-col sm="3">
          <h3>Organization</h3>
        </v-col>
        <v-col>
          {{ item.organization }}
        </v-col>
      </v-row>
      <v-row justify="start" align="center" dense>
        <v-col sm="3">
          <h3>Valid From</h3>
        </v-col>
        <v-col>
          {{ item.validFrom | humanDate }}
        </v-col>
     </v-row>
      <v-row justify="start" align="center" dense>
        <v-col sm="3">
          <h3>Expiration Date</h3>
        </v-col>
        <v-col>
          {{ item.expirationDate | humanDate }}
        </v-col>
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
</style>
