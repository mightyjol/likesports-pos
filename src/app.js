import Vue from 'vue'
import VueRouter from 'vue-router'
import VueResource from 'vue-resource'

import App from './App.vue'
import Update from './views/Update.vue'
import Login from './views/Login.vue'
import Home from './views/Home.vue'
import Settings from './views/Settings.vue'

import './../assets/css/app.styl'

const config = require('./../config/default.js');

Vue.use(VueRouter);
Vue.use(VueResource);
Vue.mixin({
  methods: {
    getConfig: function(){
    	return config;
    },
    call911: function(){
    	return 'Une erreur s\'est produite, veuillez contacter le support à ' + config.support.email;
    }
  }
});

const routes = [
	{ 
		path: '/init',
		name: 'init',
		component: Update 
	},
	{ 
		path: '/login',
		name: 'login', 
		component: Login 
	},
	{ 
		path: '/',
		name: 'app',
		component: App,
		children: [
			{
                path: 'home',
                name: 'home',
                component: Home
            },
			{
                path: 'inventory',
                name: 'inventory',
                component: Settings
            },
            {
                path: 'settings',
                name: 'settings',
                component: Settings
            }
        ]
	},

]

const router = new VueRouter({
  	routes: routes 
})

const app = new Vue({
  	router,
  	created: function() {
  		this.config = config;
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
  	methods: {
    	getConfig() {
        	return this.config
    	}
  	}
}).$mount('#app')


