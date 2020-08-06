<script>
export default {
  name: 'IFXNotFound',
  methods: {
    navigateToHome() {
      this.rtr.push({name: 'Home'})
    }
  }
}
</script>

<template>
  <v-container fluid>
    <v-row align="center" justify="center">
      <h1 class="display-1" style="color: #db564c">Not Found!</h1>
      <h3>The page you are looking for does not exist.</h3>
      <p>To navigate to the home page, please click on the button below.</p>
      <IFXButton btnText="Home" @action="navigateToHome"/>
    </v-row>
  </v-container>
</template>
