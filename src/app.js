import Vue from 'vue'
import VueRouter from 'vue-router'
import VueResource from 'vue-resource'
import ElementUI from 'element-ui'
import locale from 'element-ui/lib/locale/lang/en'

import routes from './routes/routes.js'

import './../theme/index.css'
import './../assets/css/app.styl'

const config = require ('./../config/default.js')
const initialStore = require('./../config/initialStore.js')
const mixins = require ('./mixins/global.js')

const firebase = require('firebase');
firebase.initializeApp(config.firebase)
 
const db = firebase.firestore();
const storage = firebase.storage();

Vue.use(VueRouter);
Vue.use(VueResource);
Vue.use(ElementUI, { locale });
Vue.mixin(mixins);

const router = new VueRouter({
  	routes: routes 
})

/*
router.beforeEach((to, from, next) => {
  console.error(to)
  next()
})
*/

Vue.prototype.$firebase = firebase; 
Vue.prototype.$db = db; 
Vue.prototype.$storage = storage; 

const app = new Vue({
	router,
	data: {
		store: initialStore, // make the store reactive again
		products: {}
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
	},
	computed: {
		isAdmin: function(){
			return this.store.user.isAdmin
		}
	}
}).$mount('#app')


