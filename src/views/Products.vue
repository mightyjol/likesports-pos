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
	</div>
</template>

<script>
 
export default {
	created: function(){
		if(this.isAdmin){
			this.checkAll();
		}
		else{
			this.checkedInventories = this.$root.store.user.inventory.default
		}
		console.error(this.checkedInventories)
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
			for(let i in this.$root.store.inventory){
				this.checkedInventories[i] = true
			}
		},
		uncheckAll: function(){
			console.error('check all')
			for(let i in this.$root.store.inventory){
				this.checkedInventories[i] = true
			}
		}
	},
	computed: {
		inventories: function(){
			return this.$root.store.inventory
		}
	},
	data: function () {
		return {
			errorMessage: '',
			checkedInventories: {}
		}
	}
}

</script>