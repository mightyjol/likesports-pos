<script>
	import { store as tags } from '../../stores/tags'
	import { store as sizes } from '../../stores/sizes'
	import { store as products } from '../../stores/products'
	import { get } from 'svelte/store'
 	import { stores, goto } from '@sapper/app'
	import { FieldValue } from '../../firebase/values'

 	export let doc
 	export let name
 	export let type 

	let { session } = stores()
	let db = get(session).firestore
 
 	//TODO clean size sets for products on cloud functions
 	function deleteTag(){
 		let ref = db.collection(type).doc(doc)
 		
 		if(type === 'sizes'){
 			sizes.update(s => {
 				let index = s.findIndex(x => x.id == doc)
 				let innerIndex = s[index].triggers.findIndex(x => x.name == name)
 				s[index].triggers.splice(innerIndex, 1)
 				return s
 			})
 			ref.update({
 				triggers: FieldValue.arrayRemove(name) 
 			})
 			.catch(e => console.error(e))
 		}
 		if(type === 'products'){
 			products.update(s => {
 				let index = s.findIndex(x => x.id == doc)
 				let innerIndex = s[index].tags.findIndex(x => x == name)
 				s[index].tags.splice(innerIndex, 1)
 				return s
 			})
 			ref.update({
 				tags: FieldValue.arrayRemove(name) 
 			})
 			.catch(e => console.error(e))
 		}
 	}
</script>

<div class="tags has-addons">
	<span class="tag">{name}</span>
	<button on:click={deleteTag} class="tag is-delete"></button>
</div>
