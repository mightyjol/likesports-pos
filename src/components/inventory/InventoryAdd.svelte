<script>
	import { store as inventories } from '../../stores/inventories'
	import { get } from 'svelte/store'
 	import { stores } from '@sapper/app'

	let { session } = stores()
	let db = get(session).firestore
	 
	let name = ''

	function add(){
		//todo check if name is correct client side
 		data = {
 			name: name,
 			links: {
 				ecom: false,
 				facebook: false
 			}
 		}

		db.collection('inventories').add(data)
		.then(doc => {
			console.log('added inventory', name)
			inventories.update(i => {
				data.id = doc.id
				i.push(data)
				return i
			})
			name = ''
		})
		.catch(e => {
			console.error(e)
		})
	}
</script>

<form on:submit|preventDefault="{add}">
	<input bind:value="{name}" type="text">
	<button>Add this inventory</button>
</form>
