<template>
	<div>
		<h4>Products</h4><br>
		<p v-if="errorMessage">
			{{errorMessage}}
		</p>
		<router-link :to="{ name: 'productDetail', params: { ref: 'new' }}">
			<button>
				add a new product
			</button>
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
		<br>----------------------<br>
		<table>
			<thead>
				 
				<tr>
					<th>Ref</th>
					<th>Name</th>
					<th>Update</th>
					<th>Delete</th>
				</tr>
			</thead>
			<tr v-for='p in products'>
				<td>{{ p.ref }}</td>
				<td>{{ p.metadata.name }}</td>
				<td>
					<router-link :to="{ name:'productDetail', params: {'ref': p.slug} }">
						<button>
							update		
						</button>
					</router-link>	
				</td>
				<td>
					<button @click="deleteProduct(p.slug)">
						delete
					</button>
				</td>
			</tr>
		</table>
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
				this.checkedInventories[i] = 
					this.$root.store.user.settings.inventory.default.includes(i);
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
		    console.error(this.checkedInventories)
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
			console.error('uncheck all')
			this.checkedInventories = {};
		},
		updateProduct: function(ref){

		},
		deleteProduct: function(ref){
			if(this.$root.store.products[ref] === undefined){
				console.error('wrong reference was passed', ref);
				this.errorMessage = 'an error has occured';
			}
			else{
				this.$root.store.user.client.collection('product').doc(ref).delete()
				.catch(e => {
					console.error = e
					this.errorMessage = e
				});
			}	
		}
	},
	computed: {
		inventories: function(){
			return this.$root.store.inventory
		},
		products: function(){
			let allProducts = this.$root.store.products;
			let products = {};


			products = allProducts;
			return products;
		}
	},
	data: function () {
		return {
			errorMessage: '',
			checkedInventories: {},
		}
	}
}

</script>