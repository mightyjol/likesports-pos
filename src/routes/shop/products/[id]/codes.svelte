<script>
	import { getContext, onMount } from 'svelte'
	import { stores } from '@sapper/app'
	import { get } from 'svelte/store'
	import { store as products, getSizeSet } from '../../../../stores/products'

	let { id } = getContext('product')
	let { session } = stores()
	let db = get(session).firestore

	let codeInput
	let barcode = ''

	$: product = $products.find(x => x.id === id)
	$: sizes = getSizeSet(product.tags)

	onMount(() => {
		codeInput.focus()
	})

	function addBarcode(sizeName){
		if(!barcode.length) return 
		products.update(p => {
			p.find(x => x.id === id).barcodes[sizeName] = barcode
			return p
		})

		let update = {}
		updateKey = "barcodes." + sizeName
		db.collection('products').doc(id).update({
			[`barcodes.${sizeName}`]: barcode
		})
		.then(() => {})
		.catch(e => console.error(e))

		barcode = ''
	}

	function deleteBarcode(sizeName){
		products.update(p => {
			p.find(x => x.id === id).barcodes[sizeName] = undefined
			return p
		})

		db.collection('products').doc(id).update({
			[`barcodes.${sizeName}`]: firebase.firestore.FieldValue.delete()
		})
		.then(() => {})
		.catch(e => console.error(e))
	}
</script>

{#if sizes.length}
	<div class="columns">
		{#each sizes as size}
			<div class="column is-flex is-narrow">
				<div on:click={() => addBarcode(size.name)} class="box">
					<p>{size.name}</p>
					{#if product.barcodes[size.name] != undefined} 
						<p>{ product.barcodes[size.name] }</p>
						<button on:click={() => { deleteBarcode(size.name) }} class="button">X</button>
					{/if}
					
				</div>
			</div>
		{/each}
	</div>
{:else}
	This product can have only one size
{/if}
<input bind:this={codeInput} bind:value={barcode} on:blur|preventDefault={() => {codeInput.focus()}} type="text">

