import Vue from 'vue'
import App from './App.vue'
import Buefy from 'buefy'
import 'buefy/dist/buefy.css'
import {router}  from './routes/index.js'
import axios from 'axios'

Vue.config.productionTip = false;
Vue.prototype.$http = axios;
Vue.use(Buefy);

new Vue({
  render: h => h(App),
  router,
}).$mount('#app')
