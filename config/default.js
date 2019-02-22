let config = {
	env: 'dev',
	apiRoutes: {
		base: 'http://localhost:5000/web-pos-a3642/us-central1/api',
		ping: '/',
		login: '/login',
		user: {
			current: '/security/user/current',
			logout: '/security/user/logout'
		}
	},
	support: {
		email: 'support@webcreators.be',
		phone: ''
	}
};

module.exports = config;