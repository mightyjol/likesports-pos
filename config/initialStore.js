let initialStore = {
	isLoggedIn: false,
	user: {
		uid: '',
		email: ''
	},
	prestashop: {
		domain: "",
        key: "",
        routes: {
        	ping: '/'
        }
	},
	inventoryMetadata: {
		count: 0,
		names: []
	}
};

module.exports = initialStore;
