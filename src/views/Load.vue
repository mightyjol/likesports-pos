<template>
	<div class='full-width' v-loading="bAllDone">
	</div>
</template>

<script>
	
export default {
	created: function () {
		let userUid = this.$firebase.auth().currentUser.uid;

 		this.$db.collection('user').doc(userUid)
 		.onSnapshot(doc => {
 			console.log('user updated');
 			 
 			let data = doc.data();
 			if(this.$root.store.user.client_name == data.client_name){
 				return this.logout();
 			}

 			//add data to store
 			this.$root.store.user = data;
 			this.$root.store.user.uid = doc.id;
 			 
	      	//simple role setting
			if(data.roles.includes('admin')){
				this.$root.store.user.isAdmin = true;
				this.$root.store.user.isManager = true;
				this.$root.store.user.isCashier = true;
			}
			else if(data.roles.includes('manager')){
				this.$root.store.user.isManager = true;
				this.$root.store.user.isCashier = true;
			}
			else if(data.roles.includes('cashier')){
				this.$root.store.user.isCashier = true;
			}

			if(this.bIsSyncing){
				this.loadSettings();
				this.loadInventory();
				this.loadProducts();
			}
 		});	 
	},
	methods: {
		checkIfDone: function(){
			if(this.bAllDone){
				//skipping things
				this.bIsSyncing = false;
				console.log(this.$root.store)
				 
				this.$router.replace({ name:'home' });
			}
		},
		loadSettings: function(){
			console.log('starting settings load')
			if(this.$root.store.user.isAdmin){
				this.$root.store.user.client.collection('settings')
		 		.onSnapshot(collection => {
				    if (!collection.empty) {
				    	console.log('settings updated')
				        
						collection.forEach(doc => {
							if(doc.id === 'prestashop'){
								let data = doc.data();
				        
						        //add data to store
						        this.$root.store.settings.prestashop.domain = data.domain
						        this.$root.store.settings.prestashop.key = data.key
							}
						})
				        
				        if(this.$route.name === 'load'){
			 				this.bIsSettingsLoaded = true;
					        this.checkIfDone();
					    }
				    } else {
				    	if(this.$route.name === 'load'){
				    		this.$alert('No settings collection!', 'Error: settings', {
          						confirmButtonText: 'OK',
          						type: 'error'
          					});
				        }
				    }
				},
				e => {
					if(this.$route.name === 'load'){
						this.$alert(e, 'Error: settings', {
      						confirmButtonText: 'OK',
      						type: 'error'
      					});
					}
				});		
			}
			else {
				this.bIsSettingsLoaded = true;
		        this.checkIfDone();
			}
		},
		loadInventory: function(){
			console.log('starting inventory load');

			let query = this.$root.store.user.client.collection('inventory');
			
			if(!this.$root.store.user.isAdmin){
				query = query.where('rights.read', 'array-contains', this.$root.store.user.uid);
			}			
			
	 		query.onSnapshot(collection => {
			    if (collection.empty) {
			    	console.log('no inventories')
			    	this.$root.store.inventory = Object.assign({})
			    	this.bIsInventoriesLoaded = true;
			        this.checkIfDone();
			        return
			    } else {
			    	console.log('inventory loaded')

					collection.docChanges().forEach(change => {
						console.log('before removed')
						if (change.type === "removed") {
							console.log("deleted inventory entry")
			                delete this.$root.store.inventory[change.doc.id];
			                this.$root.store.inventory = Object.assign({}, this.$root.store.inventory);
			            }
			            else{
			            	console.log("updated inventory entry")
			            	let elem = {};
			            	let data = change.doc.data();
			            	elem[change.doc.id] = data;
			            	this.$root.store.inventory = Object.assign({}, this.$root.store.inventory, elem);
			            }
		    		});

			        if(this.$route.name === 'load'){
			        	collection.forEach(doc => {
				    		
				    		let data = doc.data();
				    		this.$root.store.inventory[doc.id] = data;
			    			console.log('added', this.$root.store.inventory[doc.id]);	
				    	});
		 				this.bIsInventoriesLoaded = true;
				        this.checkIfDone();
				    }			    
			    }
			},
			e => {
				if(this.$route.name === 'load'){
					this.$alert(e, 'Error: inventory', {
  						confirmButtonText: 'OK',
  						type: 'error'
  					});
				}
			});		 
		},
		loadProducts: function(){
			this.$root.store.user.client.collection('product')
	 		.onSnapshot(collection => {
			    if (collection.empty) {
			    	console.log('no products')
			    	this.$root.store.products = Object.assign({})
			    	if(this.$route.name === 'load'){
			    		this.bIsProductsLoaded = true;
			        	this.checkIfDone();
			    	}
			        return
			    } else {
			    	console.log('products loaded')

					collection.docChanges().forEach(change => {
						if (change.type === "removed") {
							console.log("deleted product entry")
			                delete this.$root.store.products[change.doc.id];
			                this.$root.store.products = Object.assign({}, this.$root.store.products);
			            }
			            else{
			            	console.log("updated product entry")
			            	let elem = {};
			            	let data = change.doc.data();
			            	elem[change.doc.id] = data;
			            	this.$root.store.products = Object.assign({}, this.$root.store.products, elem);
			            }
		    		});

			        if(this.$route.name === 'load'){
			        	collection.forEach(doc => {
				    		let data = doc.data();
				    		this.$root.store.products[doc.id] = data;
				    		console.log('added', this.$root.store.products[doc.id]);	
				    	});
		 				this.bIsProductsLoaded = true;
				        this.checkIfDone();
				    }			    
			    }
			},
			e => {
				if(this.$route.name === 'load'){
					this.$alert(e, 'Error: products', {
  						confirmButtonText: 'OK',
  						type: 'error'
  					});
				}
			});		 
		}
	},
	computed: {
		bAllDone: function(){
			return this.bIsSettingsLoaded && 
				this.bIsInventoriesLoaded &&
				this.bIsProductsLoaded;
		}
	},
	data: function () {
		return {
			bIsSettingsLoaded: false,
			bIsInventoriesLoaded: false,
			bIsProductsLoaded: false,
			bIsSyncing: true
		}
	}
}

</script>