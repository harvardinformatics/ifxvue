<script>
import IFXItemDetailMixin from '@/components/item/IFXItemDetailMixin'
import IFXProductUsageMixin from '@/components/productUsage/IFXProductUsageMixin'

export default {
  name: 'IFXProductDetail',
  mixins: [IFXProductUsageMixin, IFXItemDetailMixin],
  components: {},
  data() {
    return {
      selected: [],
    }
  },
  created() {
    this.isLoading = true
  },
  computed: {},
  methods: {
    displayQuantityWithUnits(item) {
      const quantity = Number.parseFloat(item.decimalQuantity).toFixed(2)
      return this.pluralize(quantity, item.units)
    },
    pluralize(count, string) {
      return `${count} ${string}${count === 1 ? '' : 's'}`
    },
    getFullName(user) {
      return user.fullName ? user.fullName : `${user.firstName} ${user.lastName}`
    },
    goToUserDetailPage(user) {
      this.$router.push({ name: 'UserDetail', params: { id: user.id } })
    },
  },
}
</script>

<template>
  <v-container v-if="!isLoading">
    <IFXPageHeader>
      <template #title>
        {{ item.product }}
        <div class="text-body-2">Created {{ $humanDatetime(item.created) }}</div>
        <div class="text-body-2">Updated {{ $humanDatetime(item.updated) }}</div>
      </template>
      <template #subtitle></template>
      <template #cypress>{{ item.id }}</template>
      <template #actions>
        <IFXButton btnType="edit" xSmall @action="navigateToItemEdit(id)" />
      </template>
    </IFXPageHeader>
    <v-container px-5 py-0>
      <v-row justify="start" align="center" density="compact">
        <v-col sm="2">
          <h3>Product</h3>
        </v-col>
        <v-col>
          {{ item.product }}
        </v-col>
      </v-row>
      <v-row justify="start" align="center" density="compact">
        <v-col sm="2">
          <h3>Quantity</h3>
        </v-col>
        <v-col>
          {{ displayQuantityWithUnits(item) }}
        </v-col>
      </v-row>
      <v-row justify="start" align="center" density="compact">
        <v-col sm="2">
          <h3>Year / Month</h3>
        </v-col>
        <v-col>{{ item.year }} / {{ item.month }}</v-col>
      </v-row>
      <v-row justify="start" align="center" density="compact">
        <v-col sm="2">
          <h3>Start Date/Time</h3>
        </v-col>
        <v-col>{{ $humanDatetime(item.startDate) }}</v-col>
      </v-row>
      <v-row justify="start" align="center" density="compact">
        <v-col sm="2">
          <h3>End Date/Time</h3>
        </v-col>
        <v-col>
          <span v-if="item.endDate">{{ $humanDatetime(item.endDate) }}</span>
          <span v-else class="text-grey-darken-1">None</span>
        </v-col>
      </v-row>
      <v-row justify="start" align="center" density="compact">
        <v-col sm="2">
          <h3>Description</h3>
        </v-col>
        <v-col>
          {{ item.description }}
        </v-col>
      </v-row>
      <v-row justify="start" align="center" density="compact">
        <v-col sm="2">
          <h3>Organization</h3>
        </v-col>
        <v-col>
          {{ item.organization }}
        </v-col>
      </v-row>
      <v-row justify="start" align="center" density="compact">
        <v-col sm="2">
          <h3>Product User</h3>
        </v-col>
        <v-col>
          <router-link :to="{ name: 'UserDetail', params: { id: item.productUser.id } }">
            {{ getFullName(item.productUser) }}
          </router-link>
        </v-col>
      </v-row>
      <v-row justify="start" align="center" density="compact">
        <v-col sm="2">
          <h3>Logged By</h3>
        </v-col>
        <v-col>
          <router-link :to="{ name: 'UserDetail', params: { id: item.loggedBy.id } }">
            {{ getFullName(item.loggedBy) }}
          </router-link>
        </v-col>
      </v-row>
    </v-container>
  </v-container>
</template>
