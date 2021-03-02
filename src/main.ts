import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import './axios';
import './plugins/CurrentUser';
import vuetify from './plugins/vuetify';

/** CSS **/
import '@/style/main.scss';

Vue.config.productionTip = false

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
