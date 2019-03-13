<template>
	<div>
		<h4>Products</h4>
		<router-link :to="{ name: 'productDetail', params: { ref: 'new' }}">
			<el-button type="primary">
				add a new product
			</el-button>
		</router-link>		
		<br>----------------------<br>
		Filters	
		<button @click="checkAll()">
			check all
		</button>
		<button @click="uncheckAll()">
			uncheck all
		</button>
		<div v-for="i in inventories">
			| {{ i.name }}<input type="checkbox" :value="i.slug" :checked="checkedInventories[i.slug]" @change="check($event)"> |
		</div>
		<h5>All products</h5>
		<el-table :data="products">
			<el-table-column
				label="Ref"
				prop="ref"
			>
				
			</el-table-column>
			<el-table-column
				label="Name"
				prop="metadata.name"
			>
				
			</el-table-column>
			<el-table-column
				label="update"
			>
				<template slot-scope="scope">
					<router-link :to="{ name:'productDetail', params: {'ref': scope.row.ref} }">
						<el-button>
							update	
						</el-button>
					</router-link>	
				</template>
			</el-table-column
				label="delete"
			>
				<template slot-scope="scope">
					<router-link :to="{ name:'productDetail', params: {'ref': scope.row.ref} }">
						<el-button type="danger" @click="deleteProduct(scope.row.ref)">
							delete	
						</el-button>
					</router-link>	
				</template>
			<el-table-column
				label="delete"
			>
				
			</el-table-column>
	 	</el-table>
	</div>
</template>

<script>
 
export default {
	created: function(){
		if(this.isAdmin){
			this.checkAll();
		}
		else{
			for(let i in this.$root.store.inventory){
				this.checkedInventories[i] = this.$root.store.user.settings.inventory.default.includes(i);
			}
		}
	},
	methods: {
		check: function(e) {
			if (e.target.checked) {
		    	this.checkedInventories[e.target.value] = true 
		    }
		    else{
		    	this.checkedInventories[e.target.value] = false
		    }
		},
		checkAll: function(){
			console.error('check all')
			let full = {}
			for(let i in this.$root.store.inventory){
				full[i] = true
			}
			this.checkedInventories = Object.assign({}, full);
		},
		uncheckAll: function(){
			this.checkedInventories = {};
		},
		deleteProduct: function(ref){
			if(this.$root.store.products[ref] === undefined){
				console.error('wrong reference was passed', ref);
				this.$message({
		          	showClose: true,
		         	message: 'wrong reference was passed',
		         	type: 'error'
		        });
			}
			else{
				this.$root.store.user.client.collection('product').doc(ref).delete()
				.catch(e => {
					this.$message({
			          	showClose: true,
			         	message: e,
			         	type: 'error'
			        });
				});
			}	
		}
	},
	computed: {
		inventories: function(){
			return this.$root.store.inventory
		},
		products: function(){
			let allProducts = Object.assign({}, this.$root.store.products);
			let products = [];

			delete allProducts['new']

			for(let i in allProducts){
				products.push(allProducts[i])
			}

			return products;
		}
	},
	data: function () {
		return {
			checkedInventories: {},
		}
	}
}

</script>