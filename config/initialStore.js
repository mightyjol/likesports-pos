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
	inventoryMetadata: {
		count: 0,
		names: []
	}
};

module.exports = initialStore;

//todo move prestashop routes outside of settings