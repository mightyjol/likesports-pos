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
	},
	facebook: {
		appId: '613748622372510',
		appSecret: '3b91dd9c793c65dbf0608199d31b91a9', //todo secure this
		clientToken: '79f34fc82b60244ccc14a6bac6b5cae4'
	}
};

module.exports = config;