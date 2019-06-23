<script>
	import { store as sizes } from '../../../stores/sizes'
	import SizeSetAdd from '../../../components/sizes/SizeSetAdd.svelte'
	import SizeSetDelete from '../../../components/sizes/SizeSetDelete.svelte'
	import SizeSetUpdateName from '../../../components/sizes/SizeSetUpdateName.svelte'
	import SizeSetLabelAdd from '../../../components/sizes/SizeSetLabelAdd.svelte'
	import SizeSetLabels from '../../../components/sizes/SizeSetLabels.svelte'
	import TagManager from '../../../components/tags/TagManager.svelte'
</script>

<h1>Sizes sets</h1>
<SizeSetAdd />

{#if $sizes.length}
	{#each $sizes as size (size.id)}
		<div class="box">
			<SizeSetUpdateName id={size.id} value={size.name} />
			<SizeSetDelete id={size.id} />
			<br>
			<SizeSetLabelAdd id={size.id} />
			<br>------------<br>
			<SizeSetLabels idSet={size.id} labels={size.labels}/>
			<br>------------<br>
			<TagManager doc={size.id} store="sizes" />
		</div>
	{/each}
{:else}
	pas de sets
{/if}

