<script>
	import { store as sizes } from '../../stores/sizes'
	import { get } from 'svelte/store'
 	import { stores, goto } from '@sapper/app'

	let { session } = stores()
	let db = get(session).firestore
	let loading = false

	function add(){
		loading = true
		
		//todo check if name is not duplicate
 		data = {
 			name: 'sizes-' + (Math.random()*1000000).toFixed(0)
 		}

		db.collection('sizes').add(data)
		.then(doc => {
			if(process.dev) console.log('added size set')
			sizes.update(i => {
				data.id = doc.id
				data.labels = []
				i.push(data)
				return i
			})

			loading = false
		})
		.catch(e => {
			console.error(e)
		})
	}
</script>

<button on:click={add} class:is-loading={loading} class="button">Add a new Size Set</button>

