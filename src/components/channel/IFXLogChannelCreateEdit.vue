<script>
import { mapActions } from 'vuex'
import IFXLogChannelMixin from '@/components/channel/IFXLogChannelMixin'
import IFXItemCreateEditMixin from '@/components/item/IFXItemCreateEditMixin'
import IFXPageActionBar from '@/components/page/IFXPageActionBar'

export default {
  name: 'IFXLogChannelCreateEdit',
  mixins: [IFXLogChannelMixin, IFXItemCreateEditMixin],
  components: {
    IFXPageActionBar,
  },
  data() {
    return {
      allOrganizations: [],
    }
  },
  methods: {
    ...mapActions(['showMessage']),
    async getAdditionalData() {
      this.allOrganizations = await this.$api.organization.getList()
    },
    validateForm() {
      this.$refs.form.validate()
    },
  },
  computed: {
    title() {
      const itemTitle = 'Channel'
      if (this.isEditing) {
        return `Edit ${itemTitle} ${this.id}`
      }
      return `Create ${itemTitle}`
    },
  },
  created() {
    this.isLoading = true
  },
}
</script>

<template>
  <v-container style="max-width: 900px" v-if="!isLoading">
    <IFXPageHeader>
      <template #title>{{ title }}</template>
      <template #content>{{ description }}</template>
    </IFXPageHeader>
    <v-container>
      <v-form v-model="isValid" ref="form">
        <v-row>
        </v-row>
        <v-row>
          <v-col>
            <v-text-field
              v-model="item.name"
              label="Name"
              data-cy="name"
              :rules="formRules.generic"
              :error-messages="errors.name"
              required
              class="required"
            ></v-text-field>
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
            <!-- isUserChannel and isMandatory toggles -->
            <v-checkbox class="mt-0 pt-0" v-model="item.isUserChannel" label="Is this a user channel" data-cy="isUserChannel"></v-checkbox>
            <v-checkbox class="mt-0 pt-0" v-model="item.isMandatory" label="Is this mandatory" data-cy="isMandatory"></v-checkbox>
          </v-col>
        </v-row>
        <IFXPageActionBar btnType="submit" :disabled="!isValid" @action="submit" />
      </v-form>
    </v-container>
  </v-container>
</template>
