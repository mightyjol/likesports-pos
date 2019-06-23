<script>
	import TagSetAdd from '../../../components/tags/TagSetAdd.svelte'
	import TagSetDelete from '../../../components/tags/TagSetDelete.svelte'
	import TagSetUpdateName from '../../../components/tags/TagSetUpdateName.svelte'
	import TagAdd from '../../../components/tags/TagAdd.svelte'
	import TagSetLabels from '../../../components/tags/TagSetLabels.svelte'

	import { store as sets } from '../../../stores/tags'
</script>

<h1>Tag sets</h1>
<TagSetAdd />

{#if $sets.length}
	{#each $sets as set, i (set.id)}
		<div class="box">
			<TagSetUpdateName id={set.id} value={set.name} />
			<TagAdd id={set.id} />
			-----
			<br>
			<TagSetLabels idSet={set.id} tags={set.labels} />
			<br>
			<TagSetDelete id={set.id} {i} />
		</div>
	{/each}
{:else}
	pas de sets
{/if}

