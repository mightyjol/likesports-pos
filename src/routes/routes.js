import App from './../App.vue'
import Update from './../views/Update.vue'
import Login from './../views/Login.vue'
import Load from './../views/Load.vue'
import Home from './../views/Home.vue'
import Inventory from './../views/Inventory.vue'
import Settings from './../views/Settings.vue'
import UserSettingsComponent from './../components/settings/UserComponent.vue'
import PrestashopSettingsComponent from './../components/settings/PrestashopComponent.vue'

export default [
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
    path: '/load',
    name: 'load', 
    component: Load,
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
        component: Inventory,
        meta: {
          keepAlive: false
        }
      },
      {
        path: 'settings',
        name: 'settings',
        component: Settings,
        children: [
          {
            path: '/user',
            name: 'user',
            component: UserSettingsComponent,
            meta: {
              keepAlive: false
            }
          },
          {
            path: '/prestashop',
            name: 'prestashop',
            component: PrestashopSettingsComponent,
            meta: {
              keepAlive: false
            }
          }
        ]
      }
    ]
	},
];