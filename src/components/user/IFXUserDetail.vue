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
      <template #title>{{detailTitle}} {{item.fullName || id}}</template>
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
          <v-combobox
            v-model="item.groups"
            :items="allGroupNames"
            disabled
            multiple
            solo
            label='Groups'
            hint='Groups to which this user belongs.'
            persistent-hint
          >
            <template #selection="{item}">
              <v-chip
                :color="$api.group.colorForGroup(item)"
                close
                @click:close="removeGroup(item)"
              >
                <strong>{{ item }}</strong>
              </v-chip>
            </template>
          </v-combobox>
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
</style>
