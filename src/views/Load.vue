<template>
	<div>
		<h1 v-if="!bAllDone">
    	Loading
	    </h1>
	    <h1 v-else>
	    	Loading Complete
	    </h1>
	    <p v-if="!bIsSettingsLoaded">
	    	loading settings <span v-if="errorSettings">{{errorSettings}}</span>
	    </p>
	    <p v-else>
	    	settings loaded
	    </p>
	    <p v-if="!bIsInventoriesLoaded">
	    	loading Inventory <span v-if="errorInventories">{{errorInventories}}</span>
	    </p>
	    <p v-else>
	    	Inventory loaded
	    </p>
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
 			 
	      	//this is double checked server-side anyways
			if(data.roles.includes('admin')){
				
				this.$root.store.user.isAdmin = true;
			}

			if(this.bIsSyncing){
				this.loadSettings();
				this.loadInventory();
			}


 		});	 
	},
	methods: {
		checkIfDone: function(){
			if(this.bAllDone){
				//skipping things
				this.bIsSyncing = false;
				this.$router.replace('inventory');
			}
		},
		loadSettings: function(){
			
			this.$root.store.user.client
	 		.onSnapshot(doc => {
			    if (doc.exists) {
			    	console.log('settings updated')
			        let data = doc.data();
			        //add data to store
			        this.$root.store.settings.prestashop.domain = data.settings.prestashop.domain
			        this.$root.store.settings.prestashop.key = data.settings.prestashop.key

			        if(this.$route.name === 'load'){
		 				this.bIsSettingsLoaded = true;
				        this.checkIfDone();
				    }
			    } else {
			    	if(this.$route.name === 'load'){
			        	this.errorSettings = "No such document!";
			        }
			    }
			    console.log('store' , this.$root.store);
			},
			e => {
				if(this.$route.name === 'load'){
					console.error(e)
			    	this.errorSettings = e;
				}
			});		 
		},
		loadInventory: function(){
			this.$root.store.user.client.collection('inventory')
	 		.onSnapshot(collection => {
			    if (collection.empty) {
			    	console.log('no inventories')
			    	this.$root.store.inventory = Object.assign({})
			    	this.bIsInventoriesLoaded = true;
			        this.checkIfDone();
			        return
			    } else {
			    	console.log('inventory loaded')

					collection.docChanges().forEach(change => {
						if (change.type === "removed") {
							console.log("deleted inventory entry")
			                delete this.$root.store.inventory[change.doc.id];
			                this.$root.store.inventory = Object.assign({}, this.$root.store.inventory);
			            }
			            else{
			            	console.log("updated inventory entry")
			            	let elem = {};
			            	elem[change.doc.id] = change.doc.data();
			            	this.$root.store.inventory = Object.assign({}, this.$root.store.inventory, elem);
			            }
			            console.error(this.$root.store.inventory)
		    		});

			        if(this.$route.name === 'load'){
			        	collection.forEach(doc => {
				    		console.error('added', doc.data());
				    		this.$root.store.inventory[doc.id] = doc.data();
				    	});
		 				this.bIsInventoriesLoaded = true;
				        this.checkIfDone();
				    }			    
			    }
			},
			e => {
				if(this.$route.name === 'load'){
					console.error(e)
			    	this.errorInventories = e;
				}
			});		 
		}
	},
	computed: {
		bAllDone: function(){
			return this.bIsSettingsLoaded && this.bIsInventoriesLoaded
		}
	},
	data: function () {
		return {
			bIsSettingsLoaded: false,
			bIsInventoriesLoaded: false,
			errorSettings: '',
			errorInventories: '',
			bIsSyncing: true
		}
	}
}

</script>