import Vue from 'vue'
import VueRouter from 'vue-router'

import Initialisation from './Initialisation.vue'
import App from './App.vue'

import './../assets/css/app.styl'

Vue.use(VueRouter);

const routes = [
  { 
  	path: '/init', 
  	component: Initialisation 
  },
  { 
  	path: '/', 
  	component: App 
  }
]

const router = new VueRouter({
  routes: routes 
})

const app = new Vue({
  router,
  created: () => {
  	console.log("Vue is ready -> checkForUpdate");
	ipc.send('checkForUpdate')
  }
}).$mount('#app')

router.replace('/init');

