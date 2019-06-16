<script>
	import { store as inventories, removePhysicalInventory } from '../../stores/inventories'
	import { get } from 'svelte/store'
 	import { stores } from '@sapper/app'

	let { session } = stores()
	let db = get(session).firestore
	 
	export let id
	export let i

	function deleteInventory(){
		//todo open a modal to confirm deletion
		//todo figure out what to do with current products in inventory (or only accept delete if inventory is empty)
 	
		db.collection('inventories').doc(id).delete()
		.then(() => {
			console.error('test')
			inventories.update(invs => {
				if(invs[i].id == id){
					invs.splice(id, 1)
					return invs
				}
				else{
					console.error('inventory id not found or incorrect')
				}
			})
			removePhysicalInventory(id)
		})
		.catch(e => {
			console.error(e)
		})
	}
</script>

<button on:click="{deleteInventory}">Delete this inventory</button>
