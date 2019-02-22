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
let isLoggedIn = false;

Vue.use(VueRouter);
Vue.use(VueResource);
//TODO export thoses mixins
Vue.mixin({
  methods: {
    getConfig: function(){
      return config;
    },
    isLoggedIn: function(){
      return isLoggedIn;
    },
    login: async function(email, password){
      //TODO construct all the routes before and export them
      let { apiRoutes } = config;
      let urlLogin = apiRoutes.base + apiRoutes.login;

      //send to login
      let result = false;
      await this.$http.post(urlLogin, {
        email: email,
        password: password
      })
      .then( data => {
        if(data.status){
          isLoggedIn = true;
          result = true;
        }
        else{
          result = {
            error: true,
            errorMessage: data.error
          }
        }
      })
      .catch( e => {
        this.call911(e);
      });

      return result;
    },
    logout: async function(){
      let self = this;
      let result = false;

      const { apiRoutes } = self.getConfig();
      let urlLogout = apiRoutes.base + apiRoutes.user.logout;
      await this.$http.post(urlLogout).then( xhr => {
        if(xhr.status){
          result = true;
          isLoggedIn = false;
        }
        else{
          result = {
            error: true,
            errorMessage: xhr.errorMessage
          }
        }
      }).catch( e => {
        self.call911(e);
      });

      return result;
    },
    call911: function(error){
      console.error(error);
    	return alert('Une erreur s\'est produite, veuillez contacter le support à ' + config.support.email);
    }
  }
});

//TODO export that too
const routes = [
	{ 
		path: '/init',
		name: 'init',
		component: Update,
    meta: {
      keepAlive: false
    }
	},
	{ 
		path: '/login',
		name: 'login', 
		component: Login,
    meta: {
      keepAlive: false
    }
	},
	{ 
		path: '/',
		name: 'app',
		component: App,
		children: [
			{
        path: 'home',
        name: 'home',
        component: Home,
        meta: {
          keepAlive: false
        }
      },
			{
        path: 'inventory',
        name: 'inventory',
        component: Settings,
        meta: {
          keepAlive: false
        }
      },
      {
        path: 'settings',
        name: 'settings',
        component: Settings,
        meta: {
          keepAlive: true
        }
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
	}
}).$mount('#app')


