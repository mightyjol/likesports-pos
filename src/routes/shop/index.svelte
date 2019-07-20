<script>
	import { stores } from '@sapper/app'

	let { session } = stores()

	function openWindow(name = "pos"){
		ipc.send('open-window', {name: name})
	}

	function logout(){
		$session.auth.signOut()
		.then(() => {})
		.catch(e => {
			console.error(e)
		})
	}	
</script>

<button class="button is-primary" on:click="{() => { openWindow('pos') }}">Launch POS</button>
<button class="button" on:click="{() => { openWindow('stats') }}">Analytics</button>
<button class="button" on:click="{() => { openWindow('compta') }}">Compta</button>

<button class="button is-danger" on:click="{logout}">Logout</button>