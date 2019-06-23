<script>
	import { store as sets } from '../../stores/tags'
	import { get } from 'svelte/store'
 	import { stores } from '@sapper/app'

	let { session } = stores()
	let db = get(session).firestore
	 
	export let id
	export let i

	function deleteSet(){
		//todo open a modal to confirm deletion
		//todo delete all the related tags (use cloud functions)
 		sets.update(p => {
			if(p[i].id == id){
				p.splice(id, 1)
				return p
			}
			else{
				console.error('tag id not found or incorrect')
			}
		})

		db.collection('tags').doc(id).delete()
		.then(() => {

		})
		.catch(e => {
			console.error(e)
		})
	}
</script>

<button on:click="{deleteSet}">Delete</button>
