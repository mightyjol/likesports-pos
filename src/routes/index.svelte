<script context="module">
	export function preload(page, session){
		if(!!session.user) this.redirect(302, '/shop/settings/printers') 
	}
</script>

<script>
	import { onMount } from 'svelte';
	import { stores, goto } from '@sapper/app'

	let { session } = stores()

	let email = 'admin@testing.com'
	let password = 'testing'

	function login(){
		let unsub = session.subscribe(s => {
			if(!!s.user) goto('shop/settings/printers')
		})

		$session.auth.signInWithEmailAndPassword(email, password)
		.then(u => {
			unsub()
		})
		.catch(e => {
			console.error(e)
		})
	}

	function checkForUpdate(){
		ipc.send('check-for-update'); 
	}

</script>

<h1>Login</h1>
<form>
	<input bind:value="{email}" type="email">
	<input bind:value="{password}" type="password">
	<button type="button" on:click="{login}">Login</button>
</form>
<button on:click="{checkForUpdate}">Check for updates</button>
