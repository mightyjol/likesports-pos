<script>
	import { store as tags } from '../../stores/tags'
	import { get } from 'svelte/store'
 	import { stores, goto } from '@sapper/app'

 	export let id 

	let { session } = stores()
	let db = get(session).firestore
	
	let loading = false
	let active = false
 	let value = ''

	function addTag(){
		active = false
		loading = true
		
		//todo check if name is not duplicate
 		data = {
 			name: value
 		}
 		
		db.collection('tags').doc(id).collection('labels').add(data)
		.then(doc => {
			if(process.dev) console.log('added tag to set')

			data.id = doc.id
			tags.update(i => {
				let index = i.findIndex(x => x.id == id)
				i[index].labels.push(data)
				return i
			})

			loading = false
			value = ''
		})
		.catch(e => {
			console.error(e)
		})
	}

	function toggleActive(){
		if(active){
			addTag()
		}
		else{
			active = !active
		}
	}
</script>

{#if active}
	<input bind:value type="text">
{/if}

<button on:click={toggleActive} class="button">
	{#if active}
		Save
	{:else}
		Add a new Tag
	{/if}
</button>

