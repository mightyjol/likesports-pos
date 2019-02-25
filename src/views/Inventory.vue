<template>
	<div>
		<h6>Inventory</h6><br>
		<p v-if="errorMessage">
			{{errorMessage}}
		</p>
		<div v-if="bHasNoInventory">
			<h3>No inventory has been set</h3>
			<div v-if="this.$store.user.isAdmin">
				<input v-model="newInventoryName" type="text" placeholder="new inventory name">
				<button  v-on:click="addInventory">
					add a new inventory
				</button>
			</div>
			
			<p v-else="">Ask your admin to create one</p>
		</div>
		<table v-if="!bHasNoInventory">
			<tr>
				<td></td>
			</tr>
		</table>
	</div>
</template>

<script>

export default {
	created: function () {
		 
	},
	methods: {
		addInventory: function(){
			/*
			this.errorMessage = '';
			if(this.$store.inventoryMetadata.names.contains(this.newInventoryName)){
				this.errorMessage = 'an inventory with the same name already exists';
			}

			this.$store.user.client.collection('inventory').doc(newInventoryName).set({
				date_created: this.$firebase.firestore.FieldValue.serverTimestamp(),
				name: newInventoryName,
				productCount: 0
			})
			*/
		}
	},
	computed: {
		 
	},
	data: function () {
		return {
			errorMessage: '',
			bHasNoInventory: this.$store.inventoryCount === 0,
		}
	}
}

</script>