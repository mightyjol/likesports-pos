<script>
	import { store as inventories } from '../../../stores/inventories.js'
	import InventoryAdd from '../../../components/inventory/InventoryAdd.svelte'
	import InventoryDelete from '../../../components/inventory/InventoryDelete.svelte'
	import InventorySettings from '../../../components/inventory/InventorySettings.svelte'

	$:console.error($inventories)
</script>

{#if $inventories.length}
	<p>list of inventories</p> 
	<InventoryAdd />
	<br>
	{#each $inventories as inventory, i (inventory.id)}
		<br>
		-------------
		<br>
		<div>
			<p>{inventory.id}</p>
			<p>{inventory.name}</p>
			<InventorySettings id={inventory.id} {i}/>
			<InventoryDelete id={inventory.id} {i} />
		</div>
	{/each}
{:else}
	no inventories <br>
	<InventoryAdd />
{/if}