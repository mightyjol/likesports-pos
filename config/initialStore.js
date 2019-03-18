let initialStore = {
	isLoggedIn: false,
	user: {
		uid: '',
		email: ''
	},
	settings: {
		prestashop: {
			domain: "",
        	key: "",
        	routes: {
        		ping: '/'
        	}
		},
		tag:{
			tree: '{[]}'
		}
	},
	inventory: {},
	products: {},
	manufacturers: {},
	tags: {},
	sizes: {},
	failed: {}
};

module.exports = initialStore;

//todo move prestashop routes outside of settings