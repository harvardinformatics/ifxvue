<script>
import IFXItemDataTable from '@/components/item/IFXItemDataTable'
import IFXItemListMixin from '@/components/item/IFXItemListMixin'

export default {
  name: 'GenericBillingSummaryList',
  mixins: [IFXItemListMixin],
  components: {
    IFXItemDataTable,
  },
  props: {
    facility: {
      required: true,
      type: Object,
    },
    apiString: {
      required: true,
      type: String,
    },
    itemType: {
      required: true,
      type: String,
    },
    headers: {
      required: true,
      type: Array,
    },
    month: {
      required: false,
      default: new Date().getMonth(),
      type: Number,
    },
    year: {
      required: false,
      default: new Date().getFullYear(),
      type: Number,
    },
    extraParams: {
      required: false,
      default: () => {},
      type: Object,
    },
  },
  data() {
    return {
      fetchingData: false,
      message: '',
      messageType: 'info',
    }
  },
  mounted() {},
  methods: {
    async getSetItems() {
      this.fetchingData = true

      const params = {
        month: this.month,
        year: this.year,
        invoice_prefix: this.facility.invoicePrefix,
        ...this.extraParams,
      }
      try {
        this.items = await this.$api[this.apiString].getList(params)
      } catch (error) {
        const errorMessage = this.getErrorMessage(error)
        this.messageType = 'error'
        this.message = `Error loading ${this.facility.name} billing records: ${errorMessage}`
      }
      this.fetchingData = false
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
  },
  computed: {
    filteredHeaders() {
      return this.headers.filter((h) => !h.hide || !this.$vuetify.breakpoint[h.hide])
    },
  },
}
</script>

<template>
  <v-container class="fit-content" v-if="!isLoading">
    <v-card>
      <v-card-title>
        <v-row class="d-flex justify-space-between w-full">
          <v-col cols="4">
            <div class="text-no-wrap">
              {{ facility.name }}
            </div>
          </v-col>
        </v-row>
      </v-card-title>
      <v-row dense class="d-flex justify-space-around" v-if="message">
        <v-col cols="12" class="d-flex flex-grow-1">
          <v-alert dismissible :type="messageType" border="left" elevation="2" colored-border>
            <span v-html="message"></span>
          </v-alert>
        </v-col>
      </v-row>
      <IFXItemDataTable
        :items="items"
        :headers="filteredHeaders"
        :selected.sync="selected"
        :itemType="itemType"
        :showSelect="false"
        :defaultItemsPerPage="-1"
      >
        <template #totalDecimalCharge="{ item }">
          <span v-if="item.totalDecimalCharge">
            {{ item.totalDecimalCharge | dollars }}
          </span>
          <span v-else class="grey--text text--darken-1">No Charges</span>
        </template>
      </IFXItemDataTable>
    </v-card>
  </v-container>
</template>
<style lang="scss" scoped>
.fit-content {
  width: fit-content;
  margin-left: 0;
}
</style>
