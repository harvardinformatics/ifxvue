<script>
import { mapActions } from 'vuex'
import IFXItemCreateEditMixin from '@/components/item/IFXItemCreateEditMixin'
import IFXContactMixin from '@/components/contact/IFXContactMixin'
import IFXPageActionBar from '@/components/page/IFXPageActionBar'

export default {
  name: 'IFXPhoneContactCreateEdit',
  mixins: [IFXContactMixin, IFXItemCreateEditMixin],
  components: {
    IFXPageActionBar,
  },
  data() {
    return {}
  },
  methods: {
    ...mapActions(['showMessage']),
    async init() {
      this.item = await this.getItem()
      this.cachedItem = JSON.parse(JSON.stringify(this.item))
    },
  },
  mounted() {
    this.item.type = 'Phone'
  }
}
</script>
<template>
  <v-container>
    <v-form v-if='!isLoading' v-model='isValid'>
      <v-row>
        <v-col>
          <v-text-field
            v-model='item.name'
            label='Name'
            data-cy='name'
            :rules='formRules.generic'
            :error-messages='errors.name'
            required
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-text-field
            v-model='item.detail'
            label='Phone'
            data-cy='phone'
            :rules='formRules.phone'
            :error-messages='errors.detail'
            required
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <IFXPageActionBar :disabled="!isSubmittable" btnType="submit" @action="submit" />
        </v-col>
      </v-row>
    </v-form>
  </v-container>
</template>
