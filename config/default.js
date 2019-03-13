let config = {
	apiRoutes: {
		base: 'http://localhost:5000/web-pos-a3642/us-central1/api',
		ping: '/',
		prestashop: {
			updateSettings: '/prestashop/settings/update'
		},
		security: {
			user: {
				create: '/signup'
			}
		}
	},
	support: {
		email: 'support@webcreators.be',
		phone: ''
	},
	firebase:{
		apiKey: "AIzaSyDciuyQz7mIs0ckZHXJGpQNM6zIOPhhXWc",
		databaseURL: "https://web-pos-a3642.firebaseio.com",
		storageBucket: "web-pos-a3642.appspot.com",
		projectId: "web-pos-a3642"
	}
};

module.exports = config;