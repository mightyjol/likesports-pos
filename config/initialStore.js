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
	}
};

module.exports = initialStore;
