// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ui from './ui';

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  ui,
  router,
  template: '<App/>',
  components: { App }
})

//处理svg
var __svg__ = { 
	path: './assets/svg/source/**/*.svg', 
	name: 'assets/svg/icons.svg' 
	};
require('webpack-svgstore-plugin/src/helpers/svgxhr')(__svg__);