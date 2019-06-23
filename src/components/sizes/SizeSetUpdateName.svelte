<script>
	import { store as sizes } from '../../stores/sizes'
	import { get } from 'svelte/store'
 	import { stores, goto } from '@sapper/app'

 	export let id
	export let value

	let { session } = stores()
	let db = get(session).firestore
	let loading = false
	let active = false

	function updateName(){
		active = false
		loading = true
		
		//todo check if name is not duplicate
		//todo change all product associated (trough cloud functions)
		db.collection('sizes').doc(id).update({
			name: value
		})
		.then(doc => {
			if(process.dev) console.log('updated size set')
			sizes.update(i => {
				let index = i.findIndex(x => x.id == id)
				i[index].name = value
				return i
			})

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

