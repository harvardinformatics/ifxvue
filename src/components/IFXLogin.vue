<script>
import { mapActions } from "vuex"

export default {
  name: "IFXLogin",
  data: function() {
    return {
      success: false,
      failure: false,
      message: "",
      routeInfo: { name: "Home" }
    }
  },
  methods: {
    ...mapActions(["showMessage",'login']),
  },
  mounted() {
    this.login()
      .then(res => {
        this.success = true
        if (this.rt.query.hasOwnProperty("to")) {
          const path = this.rt.query.to.path
          this.routeInfo = { path: path }
        }
      })
      .catch(res => {
        this.failure = true
      })
      .finally(() => this.rtr.push(this.routeInfo))
  }
}
</script>

<template>
  <v-container fluid>
    <v-row align="center" justify="center">
      <v-col v-if="success">
        <h1>Login Successful</h1>
        <p>You are being routed...</p>
      </v-col>
      <v-col v-else-if="failure">
        <h1>Login Unsucessful</h1>
        <p>An error occurred while attempting to log you in. Here is the error message:</p>
        <p>{{message}}</p>
        <p>
          For more information, please contact
          <a href="mailto:informatics@rc.fas.harvard.edu">.</a>
        </p>
        <p>You are being routed...</p>
      </v-col>
      <v-col v-else>
        <h1>Logging you in...</h1>
      </v-col>
    </v-row>
  </v-container>
</template>
