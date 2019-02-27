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
		}
	},
	inventory: {},
	products: {},
	failed: {}
};

module.exports = initialStore;

//todo move prestashop routes outside of settings