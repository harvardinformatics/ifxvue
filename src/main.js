import Vue from "vue";
import App from "./App";
import vuetify from "./plugins/vuetify";
// import 'vuetify/dist/vuetify.min.css'

/* eslint-disable no-new */
new Vue({
  vuetify,
  el: "#app",
  components: { App },
  render: h => h(App),
});
