<script>
	import { store as products } from '../../../stores/products'
	import ProductAdd from '../../../components/products/ProductAdd.svelte'
	import ProductDelete from '../../../components/products/ProductDelete.svelte'
	import ProductSettings from '../../../components/products/ProductSettings.svelte'

	//$:console.error($products)
</script>

<p>list of products</p>
<ProductAdd />
{#if $products.length}
	{#each $products as product, i (product.id)}
		<br>-------------<br>	
		<div>
			<p>{product.id}</p>
			<p>{product.name}</p>
			<ProductSettings  id={product.id} {i}/>
			<ProductDelete  id={product.id} {i}/>
		</div>
	{/each}
{:else}
	there are no products
{/if}
