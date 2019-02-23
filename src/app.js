import Vue from 'vue'
import VueRouter from 'vue-router'
import VueResource from 'vue-resource'
import routes from './routes/routes.js'

import './../assets/css/app.styl'

const config = require ('./../config/default.js')
const mixins = require ('./mixins/global.js')
const initialStore = require('./../config/initialStore.js')


const firebase = require('firebase');
firebase.initializeApp(config.firebase)

Vue.use(VueRouter);
Vue.use(VueResource);
Vue.mixin(mixins);

const router = new VueRouter({
  	routes: routes 
})

Vue.prototype.$store = initialStore; 
Vue.prototype.$firebase = firebase; 

const app = new Vue({
	router,
	created: function() {
		this.config = config;
    	this.authListener();
    	this.closeListener();

		console.log("Vue is ready -> checkForUpdate");
		if(isDev){
			console.log('dev mode -> skipping update process');
			this.$router.replace('/login');
		}
		else{
			console.log('starting update process')
			router.replace('/init');
			ipc.send('checkForUpdate');
		}
	}
}).$mount('#app')


