<script context="module">
	export function preload(page, session){
		let skipper = process.dev ? '/shop/inventories' : '/shop'
		if(!!session.user) return this.redirect(302, skipper) 
	}
</script>

<script>
	import { onMount } from 'svelte';
	import { stores, goto } from '@sapper/app'

	let { session } = stores()
	
	//skips to specific url for dev purposes	
	let skipper = process.dev ? '/shop/inventories' : '/shop'
	
	let email = 'admin@testing.com'
	let password = 'testing'

	function login(){
		let unsub = session.subscribe(s => {
			if(!!s.user) goto(skipper)
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
