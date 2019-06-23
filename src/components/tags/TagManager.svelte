<script>
	import { store as sizes } from '../../stores/sizes'
	import { store as products } from '../../stores/products'
	import { store as tags, autocomplete as tagAutocomplete, tagExists, getTagFromName, tagCanBeAdded } from '../../stores/tags'
	import { get, writable } from 'svelte/store'
 	import { stores } from '@sapper/app'
 	import { FieldValue } from '../../firebase/values'
 	import Tag from './Tag.svelte'
	
 	export let store 
 	export let doc 

	let { session } = stores()
	let db = get(session).firestore

	let value = ''

	let currentStore
	if(store === 'sizes') currentStore = get(sizes)
	if(store === 'products') currentStore = get(products)

	let index = currentStore.findIndex(x => x.id == doc)
	
	$: currentTags = store === 'sizes' ? $sizes[index].triggers : $products[index].tags

	function add(){
		let current = []
		let tag = getTagFromName(value)
		if(store == 'sizes') current = $sizes[index].triggers
		if(store == 'products') current = $products[index].tags

		//check if tag can be added
		if(!tagCanBeAdded(current, tag)) return
		
		let ref = db.collection(store).doc(doc)

		//TODO refactor this
		switch(store){
			case 'sizes':
				sizes.update(s => {
					s[index].triggers.push(tag.name)
					return s
				})
				ref = ref.update({
					triggers: FieldValue.arrayUnion(tag.name) 
				})
				.then(() => {})
				.catch(e => { console.error(e) })
				break
			case 'products':
				products.update(s => {
					s[index].tags.push(tag.name)
					return s
				})
				ref = ref.update({
					tags: FieldValue.arrayUnion(tag.name) 
				})
				.then(() => {})
				.catch(e => { console.error(e) })
				break
		}

		value = ''
	}

	function autocomplete(){
		let list = tagAutocomplete()
	}
</script>

<div class="box">
	<form on:submit|preventDefault={add}>
		<input bind:value on:input={autocomplete} type="text">
		<button>add this tag</button>
	</form>
	<div>
		{#each currentTags as trigger (trigger)}
			<Tag type={store} doc={doc} name={trigger} />
		{/each}
	</div>
</div>