import Vue from 'vue'
import App from './App.vue'
import router from './router'
// import vueClickHelper from "vue-click-helper"
Vue.config.productionTip = false
// Vue.directive('click-helper', vueClickHelper)
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
