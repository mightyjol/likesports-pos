<script>
	import TagUpdateName from './TagUpdateName.svelte'
	import TagDelete from './TagDelete.svelte'

	export let tags
	export let idSet
</script>

{#if tags.length}
	{#each tags as tag (tag.id)}
		<TagUpdateName value={tag.name} id={tag.id} {idSet} />
		<TagDelete {idSet} id={tag.id}/><br>
	{/each}
{:else}
	No tags in this set
{/if}