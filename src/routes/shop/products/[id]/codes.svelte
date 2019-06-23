<script>
	import { getContext, onMount } from 'svelte'
	import { store as products, getSizeSet } from '../../../../stores/products'
	
	let { id } = getContext('product')
	let codeInput
	let barcode = ''

	$: product = $products.find(x => x.id === id)
	$: sizes = getSizeSet(product.tags)
	$:console.error(product, product.tags, sizes)
	onMount(() => {
		setTimeout(() => codeInput.focus(), 3e3)
	})

	function addBarcode(size){
		products.update(p => {
			p.find(x => x.id === id).barcodes[size] = barcode
			return p
		})

		//db.collection('products')
		barcode = ''
	}
</script>

<style>
</style>

{#if sizes.length}
	<div class="columns">
		{#each sizes as size}
			<div class="column is-narrow">
				<div on:click={() => addBarcode(size.name)} class="box">
					{size.name}
				</div>
			</div>
		{/each}
	</div>
{:else}
	This product can have only one size
{/if}
<input bind:this={codeInput} bind:value={barcode} type="text">

