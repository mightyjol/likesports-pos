<template>
	<div>
		<h1 v-if="!bAllDone">
    	Loading
	    </h1>
	    <h1 v-else>
	    	Loading Complete
	    </h1>
	    <p v-if="!bIsCurrentUserLoaded">
	    	loading current user data	<span v-if="errorUser">{{errorUser}}</span>
	    </p>
	    <p v-else>
	    	current user loaded
	    </p>
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
	created: async function () {
		let userUid = this.$store.user.uid;
 		
 		await this.$db.collection('user').doc(userUid).get()
 		.then(doc => {
 			let data = doc.data();
 			//add data to store
 			this.$store.user.client = data.client;
 			
 			this.bIsCurrentUserLoaded = true;
 			this.checkIfDone();
 		})
 		.catch(e => {
 			console.error(e);
 			this.errorUser = e;
 		});

 		let client = this.$store.user.client;
 		
 		client.get()
 		.then(doc => {
		    if (doc.exists) {
		        let data = doc.data();
		        //add data to store
		        this.updateStoreSettings(data.settings)
 				this.bIsSettingsLoaded = true;
		        this.checkIfDone();
		    } else {
		        this.errorSettings = "No such document!";
		    }
		}).catch(e => {
			console.error(e)
		    this.errorSettings = e;
		});
	},
	methods: {
		checkIfDone: function(){
			if(this.bAllDone){
				//skipping things
				this.$router.replace('prestashop');
			}
		},
		updateStoreSettings: function(settings){
		 
			if('prestashop' in settings){
				if(settings.prestashop.domain !== undefined) this.$store.prestashop.domain = settings.prestashop.domain
				if(settings.prestashop.key !== undefined) this.$store.prestashop.key = settings.prestashop.key	
			}
		}
	},
	computed: {
		bAllDone: function(){
			return this.bIsCurrentUserLoaded && this.bIsSettingsLoaded;
		}
	},
	data: function () {
		return {
			bIsCurrentUserLoaded: false,
			bIsSettingsLoaded: false,
			errorUser: '',
			errorSettings: ''
		}
	}
}

</script>