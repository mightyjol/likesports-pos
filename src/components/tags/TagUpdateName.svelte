<script>
	import { store as tags } from '../../stores/tags'
	import { get } from 'svelte/store'
 	import { stores, goto } from '@sapper/app'

 	export let id
 	export let idSet
	export let value

	let { session } = stores()
	let db = get(session).firestore
	let loading = false
	let active = false

	function updateName(){
		active = false
		loading = true
		
		tags.update(i => {
			let indexSet = i.findIndex(x => x.id == idSet)
			let index = i[indexSet].labels.findIndex(x => x.id == id)
			i[indexSet].labels[index].name = value
			return i
		})

		//todo check if name is not duplicate
		db.collection('tags').doc(idSet).collection('labels').doc(id).update({
			name: value
		})
		.then(doc => {
			if(process.dev) console.log('updated set')

			loading = false
		})
		.catch(e => {
			console.error(e)
		})
	}

	function toggleActive(){
		if(active){
			updateName()
		}
		else{
			active = !active
		}
	}
</script>

{#if active}
	<input bind:value type="text">
{:else}
	{value}
{/if}

<button on:click={toggleActive} class="button">
	{#if active}
		save
	{:else}
		change name
	{/if}
</button>

