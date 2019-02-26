<template>
	<div>
		<h6>Inventory</h6><br>
		<p v-if="errorMessage">
			{{errorMessage}}
		</p>
		<AddInventory v-if="!bHasNoInventory" />
		<IfHasInventory>
			<table>
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
		</IfHasInventory>	
	</div>
</template>

<script>
import AddInventoryComponent from './../components/inventory/AddInventoryComponent.vue';
import IfHasInventoryComponent from './../components/inventory/IfHasInventoryComponent.vue';
export default {
	components: {
		'AddInventory' : AddInventoryComponent,
		'IfHasInventory' : IfHasInventoryComponent
	},
	methods: {
		deleteInventory: function(name){
			this.errorMessage = ''
			
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