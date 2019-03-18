import App from './../App.vue'
import Update from './../views/Update.vue'
import Login from './../views/Login.vue'
import Signup from './../views/Signup.vue'
import Load from './../views/Load.vue'
import Home from './../views/Home.vue'
import Inventory from './../views/Inventory.vue'
import Products from './../views/Products.vue'
import ProductDetail from './../views/ProductDetail.vue'
import Settings from './../views/Settings.vue'
import Error404 from './../views/Error404.vue'
import UserSettingsComponent from './../components/settings/UserComponent.vue'
import PrestashopSettingsComponent from './../components/settings/PrestashopComponent.vue'
import PrinterSettingsComponent from './../components/settings/PrinterComponent.vue'
import PaymentTerminalSettingsComponent from './../components/settings/PaymentTerminalComponent.vue'
import TagsSettingsComponent from './../components/settings/TagsComponent.vue'
import SizeSettingsComponent from './../components/settings/SizeComponent.vue'

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
    path: '/signup',
    name: 'signup', 
    component: Signup,
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
        path: 'products',
        name: 'products',
        component: Products,
        meta: {
          keepAlive: false
        }
      },
      {
        path: 'products/:ref',
        name: 'productDetail',
        component: ProductDetail,
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
              keepAlive: true
            }
          },
          {
            path: '/printer',
            name: 'printer',
            component: PrinterSettingsComponent,
            meta: {
              keepAlive: false
            }
          },
          {
            path: '/payment',
            name: 'terminal',
            component: PaymentTerminalSettingsComponent,
            meta: {
              keepAlive: false
            }
          },
          {
            path: '/tags',
            name: 'tags',
            component: TagsSettingsComponent,
            meta: {
              keepAlive: false
            }
          },
          {
            path: '/size',
            name: 'size',
            component: SizeSettingsComponent,
            meta: {
              keepAlive: false
            }
          }
        ]
      }
    ]
	},
  {
    path: '*',
    name: '404',
    component: Error404,
    meta: {
      keepAlive: false
    }
  }
];