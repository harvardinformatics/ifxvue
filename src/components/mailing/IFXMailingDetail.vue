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
      <v-row row align-center justify-start dense>
        <v-col cols="1">
          <strong>Subject</strong>
        </v-col>
        <v-col>
          {{item.subject}}
        </v-col>
      </v-row>
      <v-row row align-center justify-start dense>
        <v-col cols="1">
          <strong>From</strong>
        </v-col>
        <v-col>
          {{item.fromstr}}
        </v-col>
      </v-row>
      <v-row row align-center justify-start dense>
        <v-col cols="1">
          <strong>To</strong>
        </v-col>
        <v-col>
          {{ $commaSpace(item.tostr) }}
        </v-col>
      </v-row>
      <v-row row align-center justify-start dense>
        <v-col cols="1">
          <strong>CC</strong>
        </v-col>
        <v-col>
          {{ $commaSpace(item.ccstr) }}
        </v-col>
      </v-row>
      <v-row row align-center justify-start dense>
        <v-col cols="1">
          <strong>BCC</strong>
        </v-col>
        <v-col>
          {{ $commaSpace(item.bccstr) }}
        </v-col>
      </v-row>
      <v-row row align-center justify-start dense>
        <v-col cols="1">
          <strong>Date Sent</strong>
        </v-col>
        <v-col>
          {{ $humanDatetime(item.sent) }}
        </v-col>
      </v-row>
      <v-row column wrap>
        <v-col cols="12">
          <h3>Message</h3>
        </v-col>
        <v-col>
          <p v-html="item.message"></p>
        </v-col>
      </v-row>
    </v-container>
  </v-container>
</template>
