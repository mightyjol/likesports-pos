<script context="module">
	export function preload(page, session){
		return {
			id: page.params.id
		}
	}
</script>

<script>
	import { setContext } from 'svelte'
	import { store as products } from '../../../../stores/products'
	
	export let segment
	export let id
 
	let previous = '/shop/products/'
	let url = '/shop/products/' + id + '/'

	//passing the id as context because <slot> props in layouts are not supported yet
	setContext('product', {
		id: id
	})
</script>

<style>
	li{
		display: block;
	}
	a{
		display: block;
		padding: 20px 20px;
	}
	a:hover{
		background-color: #DDD;
	}
</style>

<div class="columns">
	<div class="column is-narrow">
		<ul>
			<li><a href={url}>General</a></li>
			<li><a href={url + 'codes'}>Barcodes</a></li>
			<li><a href={url + 'images'}>Images</a></li>
			<li><a href={previous}>Back</a></li>
		</ul>
	</div>
	<div class="column">
		<slot></slot>
	</div>
</div>

