<template>
	<div>
		<div v-if="bHasNoInventory">
			<h3>No inventory has been set</h3>
			<AddInventory />
			<p v-if="!$root.isAdmin">Ask your admin to create one</p>
		</div>
		<div v-else>
			<slot></slot>
		</div>
	</div>
</template>
<script>
import AddInventoryComponent from './AddInventoryComponent.vue';
export default {
	components: {
		'AddInventory' : AddInventoryComponent
	},
	methods: {
		
	},
	computed: {
		bHasNoInventory: function(){
			return Object.keys(this.$root.store.inventory).length === 0
		}
	},
	data: function () {
		return {
			
		}
	}
}
</script>