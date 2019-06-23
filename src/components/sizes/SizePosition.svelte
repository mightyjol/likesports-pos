<script>
	import { store as sizes } from '../../stores/sizes'
	import { get } from 'svelte/store'
 	import { stores } from '@sapper/app'
	import { createEventDispatcher } from 'svelte'

	export let idSet
	export let id
	export let position

	const dispatch = createEventDispatcher();

	let { session } = stores()
	let db = get(session).firestore

	function up(){
		dispatch('positionUpdated')
		sizes.update(i => {
			let index = i.findIndex(x => x.id == idSet)
			let innerIndex = i[index].labels.findIndex(x => x.id == id)

			if(i[index].labels[innerIndex].position >= i[index].labels.length - 1) return i
			i[index].labels[innerIndex].position += 1
			if(i[index].labels[innerIndex + 1]) i[index].labels[innerIndex + 1].position -= 1

			i[index].labels.sort((a, b) => {
				return a.position - b.position
			})

			return i
		})
	}

	function down(){
		dispatch('positionUpdated')
		sizes.update(i => {
			let index = i.findIndex(x => x.id == idSet)
			let innerIndex = i[index].labels.findIndex(x => x.id == id)

			if(i[index].labels[innerIndex].position == 0) return i
			i[index].labels[innerIndex].position -= 1
			if(i[index].labels[innerIndex - 1]) i[index].labels[innerIndex - 1].position += 1

			i[index].labels.sort((a, b) => {
				return a.position - b.position
			})

			return i
		})
	}

</script>

<button on:click={up} class="button">up</button>
{position}
<button on:click={down} class="button">down</button>