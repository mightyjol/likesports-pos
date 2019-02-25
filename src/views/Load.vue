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
			if('admin' in data.roles){
				this.$root.store.user.isAdmin = true;
			}

			if(this.bIsSyncing){
				this.loadSettings();
			}


 		});	 
	},
	methods: {

		checkIfDone: function(){
			if(this.bAllDone){
				//skipping things
				this.bIsSyncing = false;
				this.$router.replace('settings');
			}
		},
		loadSettings: function(){
			console.log('settings updated')
			this.$root.store.user.client
	 		.onSnapshot(doc => {
			    if (doc.exists) {
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
		}
	},
	computed: {
		bAllDone: function(){
			return this.bIsSettingsLoaded;
		}
	},
	data: function () {
		return {
			bIsSettingsLoaded: false,
			bIsSyncing: true,
			errorSettings: ''
		}
	}
}

</script>