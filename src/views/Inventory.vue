<template>
	<el-row id="inventory">
		<el-col>
			<h4>Inventory</h4><br>
			<el-form class="inline-form" v-if="this.$root.store.user.isAdmin" @submit.native.prevent="addInventory">
				<el-input v-model="newInventoryName" type="text" placeholder="new inventory name" />
				<el-button type="primary" @click="addInventory">
					add a new inventory
				</el-button>
			</el-form>
			<div v-if="bHasInventory"> 
				<el-table :data="inventory">
					<el-table-column
						label="Name"
					>
						<template slot-scope="scope">
							{{ scope.row.getName() }} 
						</template>
					</el-table-column>
					<el-table-column
						label="product count"
					>
						<template slot-scope="scope">
							{{ scope.row.getProductCount() }} 
						</template>
					</el-table-column>
					<el-table-column
						label="Voir les produits"
					>
						<template slot-scope="scope">
							<el-button plain>
								<i class="far fa-eye"></i>
							</el-button>
						</template>
					</el-table-column>
					<el-table-column
						v-if="$root.isAdmin"
						label="Delete"
					>
						<template slot-scope="scope">
							<el-button type="danger" @click="confirmDelete(scope.row)">
								<i class="fas fa-times"></i>
							</el-button>
						</template>
					</el-table-column>
				</el-table>
			</div>
			<el-alert v-else>
				There are no inventories
			</el-alert>
		</el-col>
	</el-row>
</template>

<script>
import { Inventory } from './../core/Inventory.js';

export default { 
	methods: {
		getName: (i) => i.getName(),
		getProductCount: (i) => i.getProductCount(),
		confirmDelete: function(inventory){
			//console.error(inventory)
			this.$confirm('This will delete all associated quantities', 'Warning', {
				confirmButtonText: 'Confirm',
				cancelButtonText: 'Cancel',
				type: 'warning'
			}).then(() => {
				 inventory.delete()
				.then(() => {
					this.$message({
		          		message: 'inventory deleted successfully',
	          			type: 'success'
			        })
				})
				.catch(e => {
					console.error(e)
					this.$notify({
			          showClose: true,
			          message: e,
			          type: 'error'
			        })
				})
			}).catch(() => {});
		},
		addInventory: function(){
			if(this.$root.store.inventory[this.newInventoryName] !== undefined){
				this.$message({
					showClose: true,
	          		message: 'an inventory with the same name already exists',
          			type: 'error'
		        })
				return;
			}

			let newInventory = undefined;
			try{
				newInventory = new Inventory(this.$root.store.user.client, {
					name: this.newInventoryName
				})
				console.error(newInventory)
			}
			catch(e){
				console.error(e)
				return this.$message({
	          		message: e.message,
          			type: 'warning'
		        })
			}

			newInventory.create()
			.then(() => {
				this.newInventoryName = '';
			})
			.catch(e => {
				console.error(e);
				this.$message({
					showClose: true,
	          		message: 'an inventory with the same name already exists',
          			type: 'error'
		        })
			});
			return;
		}
	},
	computed: {
		inventory: function(){
			let inventories = []
			for(let i in this.$root.store.inventory){
				let data = this.$root.store.inventory[i];

				let newInventory = new Inventory(this.$root.store.user.client, data)
				inventories.push(newInventory);
			}

			return inventories;
		},
		bHasInventory: function(){
			return Object.keys(this.$root.store.inventory).length !== 0
		}
	},
	data: function () {
		return {
			newInventoryName: ''
		}
	}
}

</script>