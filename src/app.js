import Vue from 'vue'
import VueRouter from 'vue-router'
import VueResource from 'vue-resource'
import routes from './routes/routes.js'
import Toasted from 'vue-toasted'

import './../assets/css/app.styl'

const config = require ('./../config/default.js')
const initialStore = require('./../config/initialStore.js')
const mixins = require ('./mixins/global.js')

const firebase = require('firebase');
firebase.initializeApp(config.firebase)

const db = firebase.firestore();

Vue.use(VueRouter);
Vue.use(VueResource);
Vue.use(Toasted);
Vue.mixin(mixins);

const router = new VueRouter({
  	routes: routes 
})

Vue.prototype.$firebase = firebase; 
Vue.prototype.$db = db; 

const app = new Vue({
	router,
	data: {
		store: initialStore // make the store reactive again
	},
	created: function() {
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


