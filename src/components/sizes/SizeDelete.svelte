<script>
	import { store as sizes } from '../../stores/sizes'
	import { get } from 'svelte/store'
 	import { stores } from '@sapper/app'

	let { session } = stores()
	let db = get(session).firestore
	 
	export let idSet
	export let id

	function deleteTag(){
		//todo delete only if no products has it (or open modal with link to product list)
 		sizes.update(i => {
 			let indexSet = i.findIndex(x => x.id == idSet)
 			let indexLabel = i[indexSet].labels.findIndex(x => x.id == id)

 			i[indexSet].labels.splice(indexLabel, 1)
			return i
		})

		db.collection('sizes').doc(idSet).collection('labels').doc(id).delete()
		.then(() => {
			// idk
		})
		.catch(e => {
			console.error(e)
		})
	}
</script>

<button on:click="{deleteTag}">Delete</button>
