<script>
import { mapActions } from 'vuex'
import IFXItemCreateEditMixin from '@/components/item/IFXItemCreateEditMixin'
import IFXContactMixin from '@/components/contact/IFXContactMixin'
import IFXPageActionBar from '@/components/page/IFXPageActionBar'

export default {
  name: 'IFXFullContactCreateEdit',
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
      if (!this.item.type) {
        this.item.type = 'Email'
      }
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
          <v-text-field
            v-model='item.phone'
            label='Phone'
            data-cy='phone'
            :rules='formRules.phone'
          >
          </v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-textarea
            v-model='item.address'
            label='Address'
            data-cy='address'
            auto-grow
            :rows="3"
          ></v-textarea>
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
