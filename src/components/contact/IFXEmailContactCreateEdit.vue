<script>
import { mapActions } from 'vuex'
import IFXItemCreateEditMixin from '@/components/item/IFXItemCreateEditMixin'
import IFXContactMixin from '@/components/contact/IFXContactMixin'
import IFXPageActionBar from '@/components/page/IFXPageActionBar'

export default {
  name: 'IFXEmailContactCreateEdit',
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
      if (!this.isEditing) {
        this.item.type = 'Email'
      }
      this.cachedItem = JSON.parse(JSON.stringify(this.item))
    },
  },
}
</script>
<template>
  <v-form v-if='!isLoading' v-model='isValid'>
    <v-row dense>
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
    <v-row dense>
      <v-col>
        <v-text-field
          v-model='item.detail'
          label='Email'
          data-cy='email'
          :rules='formRules.email'
          :error-messages='errors.detail'
          required
        ></v-text-field>
      </v-col>
    </v-row>
    <v-row dense>
      <v-col>
        <IFXPageActionBar :disabled="!isSubmittable" btnType="submit" @action="submit" />
      </v-col>
    </v-row>
  </v-form>
</template>
