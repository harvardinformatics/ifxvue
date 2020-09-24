<script>
export default {
  name: 'IFXNotFound',
  methods: {
    navigateToHome() {
      this.rtr.push({ name: 'Home' })
    }
  }
}
</script>

<template>
  <v-container fill-height fluid>
    <v-row align='center' justify='center'>
      <v-col align='center' justify='center' :cols="8">
        <h1 class="display-1" style="color: #db564c">Not Found!</h1>
        <h3>The page you are looking for does not exist.</h3>
        <p>If you think this is an error, please contact
          <a style="color: #1976d2" href="mailto:rchelp@rc.fas.harvard.edu">rchelp@rc.fas.harvard.edu</a>.
          To navigate to the home page, please click on the button below.
        </p>
        <IFXButton btnType="home" btnText="Home" @action="navigateToHome"/>
      </v-col>
    </v-row>
  </v-container>
</template>
