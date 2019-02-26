<template>
	<div v-if="this.$root.store.user.isAdmin">
		<input v-model="newInventoryName" type="text" placeholder="new inventory name">
		<button  v-on:click="addInventory">
			add a new inventory
		</button>
		<p v-if="errorMessage">{{errorMessage}}</p>
	</div>
</template>
<script>

export default {
	methods: {
		addInventory: function(){
			this.errorMessage = '';
			
			const name = this.newInventoryName;
			if(name.length < 5) {
				this.errorMessage = 'name should be more then 5 chars long';
				return
			}
			
			if(this.$root.store.inventory[name] !== undefined){
				this.errorMessage = 'an inventory with the same name already exists';
				return;
			}

			this.$root.store.user.client.collection('inventory').doc(name).set({
				date_created: this.$firebase.firestore.FieldValue.serverTimestamp(),
				date_last_update: this.$firebase.firestore.FieldValue.serverTimestamp(),
				name: name,
				productCount: 0
			})
			.then(() => {
				this.newInventoryName = '';
			})
			.catch(e => {
				console.error(e);
				this.errorMessage = e;
			});
			return;
		}
	},
	data: function () {
		return {
			errorMessage: '',
			newInventoryName: ''
		}
	}
}

</script>