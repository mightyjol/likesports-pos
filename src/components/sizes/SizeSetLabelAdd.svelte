<script>
	import { store as sizes } from '../../stores/sizes'
	import { get } from 'svelte/store'
 	import { stores, goto } from '@sapper/app'

 	export let id 

	let { session } = stores()
	let db = get(session).firestore
	
	let loading = false
	let active = false
 	let value = ''

	function add(){
		active = false
		loading = true
		
		//todo check if name is not duplicate
 		data = {
 			name: value,
 			position: 0
 		}
 		
 		sizes.update(i => {
			let index = i.findIndex(x => x.id == id)
			data.position = i[index].labels.length + 1
			i[index].labels.push(data)
			return i
		})

		db.collection('sizes').doc(id).collection('labels').add(data)
		.then(doc => {
			if(process.dev) console.log('added label to set')
			data.id = doc.id

			loading = false
			value = ''
		})
		.catch(e => {
			console.error(e)
		})
	}

	function toggleActive(){
		if(active){
			add()
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
		Add a new Label
	{/if}
</button>

