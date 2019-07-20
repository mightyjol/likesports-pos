<script>
	//TODO put stock in a subcollection
	import { getContext, onMount } from 'svelte'
	import { stores } from '@sapper/app'
	import { get } from 'svelte/store'
	import { store as products, getSizeSet } from '../../../../stores/products'
	import { store as inventories } from '../../../../stores/inventories'
	import { FieldValue } from '../../../../firebase/values'
	
	let { id } = getContext('product')
	let { session } = stores()
	
	let db = get(session).firestore
	let invs = get(inventories)
	let emptyStocks = []

	for(let i of invs){
		emptyStocks.push({
			id: i.id,
			name: i.name
		})
	}

	$: product = $products.find(x => x.id === id)
	$: stocks = transformStock(product.stocks) || emptyStocks
	$: codes = getSizeSet(product.tags)
	
	$:console.error(stocks)
	
	function reset(){
		products.update(p => {
			let product = p.find(x => x.id === id)
			product.isInStock = true
			product.stocks = {}

			for(let inv of invs) { 
				product.stocks[inv.name] = {
					name: inv.name,
					codes: {}
				} 
			}

			return p
		})

		let update = {
			isInStock: true,
			stocks: {}
		}

		for(let inv of invs) { 
			update.stocks[inv.name] = {
				name: inv.name,
				codes: {}
			} 
		}

		db.collection('products').doc(id).update(update)
		.then(() => {
		})
		.catch(e => {
			console.error(e)
		})
	}

	function transformStock(stock){
		let result = []
		for(let s in stock){
			let inner = {
				name: stock[s].name,
				codes: []
			}

			for(let c in s.codes){
				inner.codes[c] = stock[s].codes[c]
			}

			result.push(inner)
		}

		return result
	}
</script>

<div>
	<div class="table-container">
		{#if product.isInStock}
			<table class="table is-narrow">
				<thead>
					<tr>
						<th></th>
						{#each codes as code}
							<th>{code.name}</th>
						{/each}
					</tr>
				</thead>
				<tbody>
					{#each stocks as row, i}
						<tr>
							<td>{row.name}</td>
							{#each codes as code}
								<td>
									<input class="input" type="number" value={stocks[i][code] || 0}>
								</td>
							{/each}
						</tr>
						
					{/each}
				</tbody>
			</table>
		{:else}
			product is not in stock
			<button on:click={reset} class="button">activate</button>
		{/if}
	</div>

</div>
