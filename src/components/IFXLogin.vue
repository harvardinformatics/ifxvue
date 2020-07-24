<script>
import axios from "axios"
import { mapActions, mapGetters } from "vuex"

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
    ...mapActions(["showMessage", "initUser", 'login']),
    async execute() {
      await this.sleep(1000)
      this.loginLocal()
      await this.sleep(100)
      this.eventHub.$emit("isLoggedIn", this.success)
      await this.sleep(1000)
      this.rtr.push(this.routeInfo)
    },
    loginLocal() {
      console.log(`loginurl in login is: ${this.LOGIN_URL}`)
      // Get the token, set the value and redirect
      axios
        .get(this.LOGIN_URL)
        .then(res => {
          if (!res.data || !res.data.token) {
            this.failure = true
            this.message = "You are a known user of this application, but your user data is malformed."
          } else {
            // If response has data and token, then it is successful
            this.success = true
            this.login()
            // Initialize user
            this.initUser(res.data)
            // Check if route query has 'to' query
            if (this.rt.query.hasOwnProperty("to")) {
              const path = this.rt.query.to.path
              this.routeInfo = { path: path }
            }
          }
        })
        .catch(function(error) {
          this.failure = true
          this.message = error
        })
    },
    sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms))
    }
  },
  computed: {
    ...mapGetters(['LOGIN_URL'])
  },
  mounted() {
    this.execute()
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
