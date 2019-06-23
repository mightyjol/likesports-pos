<script>
	import { store as products } from '../../stores/products'
	import { goto } from '@sapper/app'

	export let id
	export let i

	function productDetail(){
		//ipc.send('window-product', id)
		goto('/shop/products/' + id)
	}
</script>

<button on:click={productDetail}>voir</button>
