<script>
	import { store as sizes } from '../../stores/sizes'
	import { onDestroy } from 'svelte'
	import { get } from 'svelte/store'
 	import { stores } from '@sapper/app'
	import SizeUpdateName from './SizeUpdateName.svelte'
	import SizeDelete from './SizeDelete.svelte'
	import SizePosition from './SizePosition.svelte'

	export let labels
	export let idSet

	let { session } = stores()
	let sess =  get(session)
	let db = sess.firestore

	let updated = false

	function positionUpdated(){
		updated = true
	}

	onDestroy(() => {
		if(!updated) return

		let batch = sess.firebase.firestore().batch()
		let labels = get(sizes).find(x => x.id == idSet).labels
		
		for(let label of labels){
			let ref = db.collection('sizes').doc(idSet).collection('labels').doc(label.id)
			batch.update(ref, {
				position: label.position
			})
		}
		batch.commit().then(() => {
			console.log('updated labels')
		})
		.catch(e => console.error(e))
	})
</script>

{#if labels.length}
	{#each labels as label (label.id)}
		<SizeUpdateName value={label.name} id={label.id} {idSet} />
		<SizeDelete {idSet} id={label.id} />
		<SizePosition on:positionUpdated={positionUpdated} id={label.id} position={label.position} {idSet} />
		<br>-----<br>	
	{/each}
{:else}
	No labels in this set
{/if}