<template>
  <v-container class="non-field-container v-messages__wrapper">
    <transition name="fade">
      <div class="v-messages__message error--text">{{errors.non_field_errors}}</div>
    </transition>
  </v-container>
</template>

<script>
export default {
  name: 'IFXPageErrorDisplay',
  props: {
    errors: {
      type: Object,
      required: false
    },
  },
  data() {
    return {
      show: true
    }
  }
}
</script>

<style>
.non-field-container {
  height: .8rem;
}
.non-field-text {
  color: red;
  font-size: .8rem;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>
