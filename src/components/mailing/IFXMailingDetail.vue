<script>
import IFXMailingMixin from '@/components/mailing/IFXMailingMixin'
import IFXItemDetailMixin from '@/components/item/IFXItemDetailMixin'

export default {
  name: 'IFXMailingDetail',
  mixins: [IFXMailingMixin, IFXItemDetailMixin],
  props: {
    selectedMailing: Object
  },
  methods: {
    navigateToItemEdit() {
      const params = {
        from: this.item.fromstr,
        subject: this.item.subject,
        message: this.item.message,
      }
      const fields = ['to', 'cc', 'bcc']
      fields.forEach((field) => {
        const fieldName = `${field}str`
        if (this.item[fieldName]) {
          const emails = this.item[fieldName].split(',')
          params[field] = emails.map((email) => {
            const match = email.match(/<([^>]+)>/)
            if (match) {
              return match[1].trim()
            }
            return email
          }).join(',')
        }
      })
      this.rtr.push({
        name: 'MailingCompose',
        params: params,
        query: { next: this.$route.path }
      })
    },
    async getItem() {
      if (this.selectedMailing) {
        return this.selectedMailing
      }
      return this.$api.mailing.getByID(this.id)
    }
  }
}
</script>

<template>
  <v-container v-if="!isLoading">
    <IFXPageHeader>
      <template #title>{{detailTitle}}: </template>
      <template #id>{{id}}</template>
      <template #actions>
        <IFXButton v-if='$api.auth.isAdmin' btnType="edit" @action="navigateToItemEdit(id)"/>
      </template>
    </IFXPageHeader>
    <v-container px-5 py-0>
      <v-row>
        <v-col>
          <h3>Subject</h3>
          <p>{{item.subject}}</p>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <h3>From</h3>
          <p>{{item.fromstr}}</p>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <h3>To</h3>
          <p>{{item.tostr | commaSpace}}</p>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <h3>CC</h3>
          <p>{{item.ccstr | commaSpace}}</p>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <h3>BCC</h3>
          <p>{{item.bccstr | commaSpace}}</p>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <h3>Date Sent</h3>
          <p>{{item.sent | humanDatetime}}</p>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <h3>Message</h3>
          <p>{{item.message}}</p>
        </v-col>
      </v-row>
    </v-container>
  </v-container>
</template>
