<script>
	import { onMount } from 'svelte'

	let modalActive = false
	let currentSelect = undefined
	let printers = []
	let settings = {}

	onMount(() => {
		ipc.on('printers', (event, list) => {
			console.log('received printers', list)
			printers = list
			modalActive = true
		})

		ipc.on('settings', (event, current) => {
			console.log('received settings', current)
			settings = current.printers
			modalActive = false
		})

		ipc.send('get-settings')
	})

	function getPrinters(type){
		currentSelect = type
		ipc.send('get-printers')
	}

	function selectPrinter(name){
		ipc.send('set-printer', {
			type: currentSelect, 
			deviceName: name
		})
	}

	function printTest(type){
		//todo implement that
		ipc.send('print', {
			type: type,
			isTest: true
		})
	}

	function toggleModal(){
		modalActive = !modalActive
	}
</script>

<div class:is-active="{modalActive}" class="modal">
	<div class="modal-background"></div>
	<div class="modal-content">
		<div class="box">
			<h1>printer list</h1>
			{#each printers as printer}
				<div>
					<p>{printer.name}</p>
					<button on:click="{() => { selectPrinter(printer.name)}}">select</button>
				</div>
			{/each}
		</div>
	</div>
	<button on:click="{toggleModal}" class="modal-close is-large" aria-label="close"></button>
</div>

<h1>Printers</h1>
<div>
	<p>A4</p>
	{#if settings.a4 }
		<p>current: {settings.a4.name}</p>
		<button on:click="{() => {printTest('a4')}}">
			print test page
		</button>
	{/if}
	<button on:click="{() => { getPrinters('a4') }}">change printer</button>
</div>

<div>
	<p>ticket printer</p>
	{#if settings.ticket}
		<p>current: {settings.ticket.name}</p>
		<button on:click="{() => {printTest('ticket')}}">
			print test page
		</button>
	{/if}
	<button on:click="{() => { getPrinters('ticket') }}">change printer</button>
</div>

