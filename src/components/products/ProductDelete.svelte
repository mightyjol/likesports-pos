<script>
	import { store as products } from '../../stores/products'
	import { get } from 'svelte/store'
 	import { stores } from '@sapper/app'

	let { session } = stores()
	let db = get(session).firestore
	 
	export let id
	export let i

	function deleteProduct(){
		//todo open a modal to confirm deletion
		//todo delete only if not in stock in any inventory
 		products.update(p => {
			if(p[i].id == id){
				p.splice(id, 1)
				return p
			}
			else{
				console.error('product id not found or incorrect')
			}
		})

		db.collection('products').doc(id).delete()
		.then(() => {
		})
		.catch(e => {
			console.error(e)
		})
	}
</script>

<button on:click="{deleteProduct}">Delete</button>
