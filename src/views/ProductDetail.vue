<template>
	<div>
		<h6>Inventory</h6><br>
		<p v-if="errorMessage">
			{{errorMessage}}
		</p>

		<AddInventory v-if="!bHasNoInventory" />
		<div v-if="bHasNoInventory">
			<h3>No inventory has been set</h3>
			<AddInventory />
			<p v-if="!$root.isAdmin">Ask your admin to create one</p>
		</div>
		<table v-if="!bHasNoInventory">
			<div v-for='i in inventory'>
				<table>
					<tr>
						<td>{{i.name}}</td>
						<td>{{i.productCount}}</td>
						<td>
							<button>
								voir tout les produits
							</button>
						</td>
						<td v-if="$root.isAdmin" v-on:click="deleteInventory(i.name)">
							<button>
								delete this
							</button>
						</td>
					</tr>
				</table>
			</div>
		</table>
	</div>
</template>

<script>
import AddInventoryComponent from './../components/inventory/AddInventoryComponent.vue';
export default {
	components: {
		'AddInventory' : AddInventoryComponent
	},
	methods: {
		deleteInventory: function(name){
			this.errorMessage = ''
			console.error(name)
			this.$root.store.user.client.collection('inventory').doc(name).delete()
			.then(() => {})
			.catch(e => {
				console.error(e)
				this.errorMessage = e;
			})
		}
	},
	computed: {
		inventory: function(){
			return this.$root.store.inventory
		},
		bHasNoInventory: function(){
			return Object.keys(this.$root.store.inventory).length === 0
		}
	},
	data: function () {
		return {
			errorMessage: ''
		}
	}
}

</script>