<script>
import {mapGetters, mapActions} from 'vuex'

export default {
  name: "Dialog",
  methods: {
    ...mapActions([
      'closeDialog'
    ]),
    triggerClose() {
      this.closeDialog()
    }
  },
  computed: {
    ...mapGetters([
      'open'
    ])
  }
};
</script>

<template>
  <div class="text-xs-center">
      Hello from Message
  </div>
</template>