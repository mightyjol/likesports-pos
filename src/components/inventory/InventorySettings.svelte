<script>
	import { store as inventories, addPhysicalInventory, removePhysicalInventory } from '../../stores/inventories'
	import { local as localSettings } from '../../stores/settings'
	import { get } from 'svelte/store'
 	import { stores } from '@sapper/app'

	let { session } = stores()
	let db = get(session).firestore
	 
	export let id
	export let i

	let active = false
	$: links = $inventories[i].links

	function showSettings(){
		active = true
	}

	function update(){
		if($inventories[i].isPhysical){
			addPhysicalInventory($inventories[i].id)
		}
		else{
			removePhysicalInventory($inventories[i].id)
		}

		db.collection('inventories').doc(id).update({
			links: links
		})
		.then(() => {
			active = false
		})
		.catch(e => {
			console.error(e)
		})
	}
</script>

<div class:is-active={active} class="modal">
	<div class="modal-background"></div>
	<div class="modal-content">
		<div class="box">
			<label class="checkbox">
				<input type="checkbox" bind:checked={$inventories[i].isPhysical}>
				physical
			</label>
			<label class="checkbox">
				<input type="checkbox" bind:checked={$inventories[i].links.ecom}>
				e-commerce
			</label>
			<label class="checkbox">
				<input type="checkbox" bind:checked={$inventories[i].links.facebook}>
				facebook
			</label>
			<button on:click={update}>Save changes</button>
		</div>
	</div>
	<button on:click={() => active = false} class="modal-close is-large" aria-label="close"></button>
</div>

<button on:click={showSettings}>settings</button>
