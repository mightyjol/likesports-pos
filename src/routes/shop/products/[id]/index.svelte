<script>
	import { onMount, onDestroy, getContext } from 'svelte'
	import { goto, stores } from '@sapper/app'
	import { get } from 'svelte/store'
	import { store as products } from '../../../../stores/products'
	import InputFloat from '../../../../components/form/InputFloat.svelte'
	import TagManager from '../../../../components/tags/TagManager.svelte'

	let { id } = getContext('product')

	let { session } = stores()
	let db = get(session).firestore
	let updated = false 

	$: product = $products.find(x => x.id === id)
	$:console.error(product)
	//price change
	$: if(product && product.price.pa > 100){
		product.price.pa /= 10 
		hasUpdated()
	}
	
	//TODO find a cleaner way to figure out if things have been updated 
	function hasUpdated(){
		updated = true
		console.error('updated')
	}

	function hasBeenUpdated(){
		updated = false
		console.log('updated product', id)
	}

	onMount(() => {
		if(!$products.length || !product) {
			goto('/shop/products')
		}
	})

	onDestroy(() => {
		if(!updated) return

		db.collection('products').doc(id).update({
			ref: product.ref,
			name: product.name,
			price: {
				pa: product.price.pa,
				pv: product.price.pv,
				pvttc: product.price.pvttc
			}
		})
		.then(() => {
			hasBeenUpdated()
		})
		.catch(e => console.error(e))
	})
</script>

{#if product}
	product id: { product.id } <br>
	<div class="field">
		<label class="label">Ref (optional)</label>
		<div class="control">
			<input bind:value={product.ref} on:input={hasUpdated} type="text">
		</div>
	</div>
	<div class="field">
		<label class="label">Name</label>
		<div class="control">
			<input bind:value={product.name} on:input={hasUpdated} type="text">
		</div>
	</div>
	<br>
	--------
	<br>
	<div class="field">
		<label class="label">Price</label>
		<div class="control">
			<InputFloat value={product.price.pa} on:input={hasUpdated} placeholder="prix d'achat"/>
		</div>
	</div>
	<div class="field">
		<div class="control">
			<InputFloat value={product.price.pv} on:input={hasUpdated} placeholder="prix de vente"/>
		</div>
	</div>
	<div class="field">
		<div class="control">
			<InputFloat value={product.price.pvttc} on:input={hasUpdated} placeholder="prix de vente TTC"/>
		</div>
	</div>
	<br>
	--------
	<br>
	Tags <br>
	<TagManager store='products' doc={id} />
{/if}