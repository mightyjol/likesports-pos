<script>
	import { getContext, onMount } from 'svelte'
	import { stores } from '@sapper/app'
	import { get } from 'svelte/store'
	import { store as products } from '../../../../stores/products'
	
	let { id } = getContext('product')
	let { session } = stores()
	let currentSession = get(session)
	
	let db = currentSession.firestore
	let storage = currentSession.storage.ref()
	let baseRef = storage.child('clients/products/' + id + '/')

	let files
	let loading = false 

	$: product = $products.find(x => x.id === id)

	//TODO put this somewhere else
	/* Simple hash function. */
	function hash(s) {
	    var a = 1, c = 0, h, o;
	    if (s) {
	        a = 0;
	        /*jshint plusplus:false bitwise:false*/
	        for (h = s.length - 1; h >= 0; h--) {
	            o = s.charCodeAt(h);
	            a = (a<<6&268435455) + o + (o<<14);
	            c = a & 266338304;
	            a = c!==0?a^c>>21:a;
	        }
	    }
	    return String(a);
	}

	//TODO make sure this works offline
	//TODO move the product update to cloud functions
	//TODO use some sort of CDN 
	//TODO reframe and modify images before upload (imagekit.io?)
	async function add(){	
		loading = true

		let promises = []
		let urlPromises = []
		let urls = []
		
		for(let file of files){
			let r = baseRef.child(hash(file.name))

			let promise = r.put(file).then(snapshot => {
				console.error(snapshot)
			})
			.catch(e => { console.error(e) })

			promises.push(promise)
		}

		await Promise.all(promises)
		.then(() => {
			console.error("finished upload")
		})
		.catch(e => console.error(e))
		
		let i = product.images[product.images.length - 1].position
		for(let file of files){
			let r = baseRef.child(hash(file.name))
			let position = i++
			let data = { position: position }

			let urlPromise = r.getDownloadURL().then(async url => {
				data.url = url
				await db.collection('products').doc(id).update({
					images: firebase.firestore.FieldValue.arrayUnion(data)
				})
				.then(() => {
					products.update(p => {
						p.find(x => x.id == id).images.push(data)
						return p
					})
				})
				.catch(e => console.error(e))
			})
			.catch(e => console.error(e))

			urlPromises.push(urlPromise)
		}

		await Promise.all(urlPromises)
		.then(() => {
			console.error("finished url")
		})
		.catch(e => console.error(e))

		loading = false
	}

	//TODO update position trough cloud functions after delete
	function deleteImage(position){
		products.update(p => {
			let index = p.find(x => x.id == id).images.findIndex(x => x.position == position)
			p.find(x => x.id == id).images.splice(index, 1)
			return p
		})

		//TODO clean the image from storage bucket via cloud function
		db.collection('products').doc(id).update({
			images: product.images.filter(x => x.position != position)
		})


	}

	//TODO find a way to hard-cache images
	//TODO images compression and reframing
</script>

<style>
 	.column{
 		min-width: 150px;
 		max-width: 250px;
 	}
		
	figure{
		cursor: pointer;
	}

 	img{
 		max-width: 100%;
 	}
</style>

{#if product.images}
	<div class="columns is-multiline is-vcentered is-flex">
		{#each product.images as img (img.position)}
			<div class="column">
				<figure on:click={() => {deleteImage(img.position)}} class="image">
					<img src="{img.url}" alt="test">
				</figure>
			</div>
		{/each}
	</div>
{:else}
	No Images yet
{/if}
{#if loading}
	Loading
{:else}
	<input bind:files on:change={add} type="file" multiple>
{/if}
