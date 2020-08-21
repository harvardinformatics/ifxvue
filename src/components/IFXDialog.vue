<script>
import { mapGetters, mapActions } from "vuex"

export default {
  name: "IFXDialog",
  props: {
    componentToRender: {
      default: "None",
      type: String
    }
  },
  methods: {
    ...mapActions(["closeDialog"]),
    triggerClose() {
      this.closeDialog()
    }
  },
  computed: {
    ...mapGetters(["isDialogOpen"])
  }
}
</script>

<template>
  <v-dialog @input="triggerClose()" :value="isDialogOpen" width="auto" :fullscreen="$vuetify.breakpoint.xsOnly">
    <component :is="componentToRender"></component>
  </v-dialog>
</template>