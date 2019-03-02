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
			manufacturer: null,
			tags: [],
			qty_total: 0,
			qty : {},
			size_type: null,
			barcodes: {}
		},
	},
	manufacturers: {},
	tags: {},
	sizes: {},
	failed: {}
};

module.exports = initialStore;

//todo move prestashop routes outside of settings