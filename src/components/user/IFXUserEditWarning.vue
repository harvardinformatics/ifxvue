<template>
  <v-container v-if="user && user.username && !user.ifxid">
    <v-card>
      <v-card-title class="headline">
        Edit of {{user.username}} not permitted
      </v-card-title>
      <v-card-text>
        <v-alert :value="true" type="error" outlined>
          Application users that are not associated with a Person cannot be edited with this form.  Use Django admin forms for these edits.
        </v-alert>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
export default {
  name: 'IFXUserEditWarning',
  props: {
    user: {
      type: Object,
      required: true
    }
  }
}
</script>
