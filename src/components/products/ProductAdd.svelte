<script>
	import { store as products } from '../../stores/products'
	import { get } from 'svelte/store'
 	import { stores, goto } from '@sapper/app'

	let { session } = stores()
	let db = get(session).firestore
	let loading = false

	function add(){
		loading = true
		//todo check if ref is not duplicate
 		data = {
 			ref: '',
 			name: '',
 			price: {
 				pa: 0,
 				pv: 0,
 				pvttc: 0
 			},
 			tags: [],
 			barcodes: {}
 		}

		db.collection('products').add(data)
		.then(doc => {
			if(process.dev) console.log('added product')
			products.update(i => {
				data.id = doc.id
				i.push(data)
				return i
			})
			
			goto('/shop/products/' + doc.id)
			loading = false
		})
		.catch(e => {
			console.error(e)
		})
	}
</script>

<button on:click={add} class:is-loading={loading} class="button">Add a new product</button>

