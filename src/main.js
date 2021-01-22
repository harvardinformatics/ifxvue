/* eslint-disable import/extensions */
/* eslint-disable brace-style, no-else-return, import/no-unresolved */
import Vue from 'vue'
import App from './App'
import vuetify from './plugins/vuetify.js';
import 'vuetify/dist/vuetify.min.css'

console.log(App)

/* eslint-disable no-new */
new Vue({
  vuetify,
  el: '#app',
  // router,
  components: { App },
  render: h => h(App)
})
