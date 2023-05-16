<script>
export default {
  name: 'IFXForbidden',
  props: {
    msg: {
      type: String,
      required: false,
      default: 'You are not authorized to view this page.',
    },
  },
  methods: {
    navigateToHome() {
      this.rtr.push({ name: 'Home' })
    },
  },
}
</script>

<template>
  <v-container fill-height fluid>
    <v-row>
      <v-col>
        <h1 class="text-h1 font-weight-medium forbidden pb-3">Forbidden</h1>
        <h2 class="text-h2 font-weight-medium msg pb-2">{{ msg }}</h2>
        <slot>
          <p>
            If you think this is an error, please contact
            <a class="mail-to" href="mailto:rchelp@rc.fas.harvard.edu">rchelp@rc.fas.harvard.edu</a>
            .
          </p>
          <IFXButton btnType="home" btnText="Home" @action="navigateToHome" />
        </slot>
      </v-col>
    </v-row>
  </v-container>
</template>
<style lang="scss" scoped>
.forbidden {
  color: #db564c;
}
.msg {
  font-size: 1.17em;
  font-weight: bold;
}
.mail-to {
  color: #1976d2;
}
</style>
