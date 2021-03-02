<template>
  <v-dialog v-model="isActiveLocal" persistent class='user-info-dialog'>
    <v-card>
      <v-card-title class="headline">Confirm Change to User Information</v-card-title>
      <v-card-text>
        <div>Note: this change may affect user information in related FAS systems.</div>
        <v-text-field
          v-model="changeCommentLocal"
          label="Please enter change comment"
          :rules="formRules.generic"
          required
        ></v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <IFXButton @action='deactivate' btnType='close'></IFXButton>
        <IFXButton @action="$emit('complete-action')" btnType='submit'></IFXButton>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'IFXUserInfoDialog',
  props: {
    isActive: {
      type: Boolean,
      required: true
    },
    changeComment: {
      type: String,
      required: false,
      default: ''
    }
  },
  methods: {
    deactivate() {
      this.isActiveLocal = false
    }
  },
  computed: {
    isActiveLocal: {
      get() {
        return this.isActive
      },
      set(bool) {
        this.$emit('update:isActive', bool)
      }
    },
    changeCommentLocal: {
      get() {
        return this.comment
      },
      set(text) {
        this.$emit('update:comment', text)
      }
    }
  }
}
</script>

<style scoped>
.user-dialog {
  min-width: 330px;
  max-width: 600px;
}
</style>
