<template>
	<div>
		<h4>Products</h4><br>
		<p v-if="errorMessage">
			{{errorMessage}}
		</p>
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
				<td>p.ref</td>
				<td>p.name</td>
				<td>
					<button @click="updateProduct(p.ref)">
						update		
					</button>
				</td>
				<td>
					<button @click="deleteProduct(p.ref)">
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

		}
	},
	computed: {
		inventories: function(){
			return this.$root.store.inventory
		},
		products: function(){
			return this.$root.store.products
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