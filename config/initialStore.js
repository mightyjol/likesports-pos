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
	inventory: {}
};

module.exports = initialStore;

//todo move prestashop routes outside of settings