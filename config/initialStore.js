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
	products: {
		new: {
			ref: '',
			metadata: {
				name: '',
				description: '',
				active: true,
				online: false,
				isPartOfPack: false
			},
			price: {
				pa: 0.00,
				pvttc: 0.00
			},
			manufacturer: undefined,
			tags: [],
			qty_all: 0
		},
	},
	manufacturers: {},
	tags: {
		nike: {
			ref: 'nike',
			name: 'Nike'
		}
	},
	failed: {}
};

module.exports = initialStore;

//todo move prestashop routes outside of settings