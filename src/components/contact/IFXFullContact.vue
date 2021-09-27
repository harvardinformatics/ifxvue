<script>
import { mapActions } from 'vuex'
import IFXItemCreateEditMixin from '@/components/item/IFXItemCreateEditMixin'
import IFXContactMixin from '@/components/contact/IFXContactMixin'

export default {
  name: 'IFXFullContact',
  mixins: [IFXContactMixin, IFXItemCreateEditMixin],
  data() {
    return {}
  },
  methods: {
    ...mapActions(['showMessage']),
    async init() {
      this.item = await this.getItem()
      this.cachedItem = JSON.parse(JSON.stringify(this.item))
      // TODO: only get chunks
      this.allUsers = await this.$api.user.getList()
        .catch(err => this.showMessage(err))
    },
  },
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
      <v-row>
        <v-col>
          <v-select
            v-model='item.type'
            label='Type'
            data-cy='type'
            :items='apiRef.types'
            :rules='formRules.generic'
            :error-messages='errors.type'
            required
          ></v-select>
        </v-col>
        <v-col>
          <v-text-field
            v-model='item.phone'
            label='Phone'
            type='number'
            data-cy='phone'
            :rules='formRules.phone'
          >
          </v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-text-field
            v-model='item.address'
            label='Address'
            data-cy='address'
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <IFXButton :disabled='!isSubmittable' btnType='submit' @action='submit' />
        </v-col>
      </v-row>
    </v-form>
  </v-container>
</template>
