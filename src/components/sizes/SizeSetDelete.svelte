<script>
	import { store as sizes } from '../../stores/sizes'
	import { get } from 'svelte/store'
 	import { stores } from '@sapper/app'

	let { session } = stores()
	let db = get(session).firestore
	 
	export let id

	function deleteSet(){
		//todo open a modal to confirm deletion
		//todo delete all the related tags (use cloud functions)
 		sizes.update(p => {
			let index = p.findIndex(x => x.id == id)
			p.splice(index, 1)
			return p
		})

		db.collection('sizes').doc(id).delete()
		.then(() => {

		})
		.catch(e => {
			console.error(e)
		})
	}
</script>

<button on:click="{deleteSet}">Delete</button>
