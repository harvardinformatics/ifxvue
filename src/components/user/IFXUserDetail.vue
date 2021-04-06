<script>
import IFXUserMixin from '@/components/user/IFXUserMixin'
import IFXItemSelectList from '@/components/item/IFXItemSelectList'
import IFXItemDetailMixin from '@/components/item/IFXItemDetailMixin'
import IFXSelectableContact from '@/components/contact/IFXSelectableContact'
import IFXSelectableAffiliation from '@/components/affiliation/IFXSelectableAffiliation'
import IFXLoginIcon from '@/components/IFXLoginIcon'
import IFXItemHistoryDisplay from '@/components/item/IFXItemHistoryDisplay'

export default {
  name: 'IFXUserDetail',
  mixins: [IFXUserMixin, IFXItemDetailMixin],
  components: {
    IFXLoginIcon,
    IFXItemHistoryDisplay,
    IFXItemSelectList,
    IFXSelectableContact,
    IFXSelectableAffiliation
  },
  data() {
    return {
      allGroupNames: [],
    }
  },
  computed: {
    appName() {
      return this.$api.vars.appName
    }
  }
}
</script>

<template>
  <v-container v-if="!isLoading">
    <IFXPageHeader>
      <template #title>{{item.fullName || id}}<v-icon color="yellow darken-1" class="ml-2 mb-1 key-background" v-if="item.isAdmin">mdi-key</v-icon></template>
      <template #actions>
        <IFXLoginIcon disabled v-if='item.isActive !== undefined' :isActive='item.isActive'/>
        <IFXButton btnType="edit" @action="navigateToItemEdit(id)"/>
      </template>
      <template #content>
        <IFXItemHistoryDisplay :item='item'/>
      </template>
    </IFXPageHeader>
    <v-container>
      <v-row no-gutters>
        <v-col sm="2">
          <h3>First Name</h3>
          <h3>Last Name</h3>
          <h3>Primary Email</h3>
        </v-col>
        <v-col sm="3">
          <div class="data-item">{{item.firstName}}</div>
          <div class="data-item">{{item.lastName}}</div>
          <div class="data-item">{{item.primaryEmail}}</div>
        </v-col>
        <v-col sm="7">
          <h3>Groups to which this user belongs</h3>
          <span v-if="item.groups" class="d-flex flex-column">
            <div v-for="group in item.groups" :key="group" class="d-flex align-center">
              <v-icon class="mr-1">{{$api.group.iconForGroup(group)}}</v-icon>
              <span>{{group}}</span>
            </div>
          </span>
          <span v-else>None</span>
        </v-col>
      </v-row>
      <v-row>
      </v-row>
      <v-row>
        <v-col>
          <IFXItemSelectList
            title='Contacts'
            disabled
            :items='item.contacts'
            >
            <template v-slot='{item}'>
              <IFXSelectableContact :disabled='true' :item='item'/>
            </template>
          </IFXItemSelectList>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <IFXItemSelectList
            title='Affiliations'
            disabled
            :items='item.affiliations'
            >
            <template v-slot='{item}'>
              <IFXSelectableAffiliation :disabled='true' :item='item'/>
            </template>
          </IFXItemSelectList>
        </v-col>
      </v-row>
    </v-container>
  </v-container>
</template>

<style scoped>
  .action-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .data-item {
    padding-top: 1px;
    padding-bottom: 1px;
  }

  .key-background {
    background-color: #90A4AE;
    border-radius: 50%;
    padding: 5px;
  }
</style>
