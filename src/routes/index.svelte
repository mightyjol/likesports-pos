<script>
	import { onMount } from 'svelte';
	import { stores, goto } from '@sapper/app'

	let { session } = stores()
	
	let loadingLogin = false
	let loadingOffline = false

	let email = 'admin@testing.com'
	let password = 'testing'

	function login(){
		console.log('logging in')
		loadingLogin = true
		$session.auth.signInWithEmailAndPassword(email, password)
		.then(u => {})
		.catch(e => console.error(e))
	}

	function offline(){
		alert('TODO: implement this')
		//loadingOffline = true
		//ipc.send('go-offline'); 
	}

	function checkForUpdate(){
		ipc.send('check-for-update'); 
	}

</script>

<div class="hero is-fullheight">
	<div class="hero-body">
		<div class="container">
			<div class="columns is-centered is-vcentered">
				<div class="column is-narrow has-text-centered">
					<h1 class="title">
						<img src="/logo-192.png" width="100px" height="auto" alt="logo">
					</h1>
					<h2 class="subtitle">
						Login
					</h2>
					<div class="box">
						
						<form>
							<div class="field">
								<input bind:value={email} class="input" type="email">
							</div>
							<div class="field">
								<input bind:value={password} class="input" type="password">
							</div>
							<div class="field">
								<button class:is-loading={loadingLogin} on:click={login} class="button is-primary is-fullwidth" type="button" >Login</button>
							</div>
						</form>
					</div>
					<button on:click={offline} class:is-loading={loadingOffline} class="button is-outlined is-danger">
						Offline Mode
					</button>
				</div>
			</div>
		</div>
	</div>
	<div class="hero-foot has-text-centered">
		<a href="/changelog">changelog</a>
	</div>
	<div class="is-pulled-right">
		<button on:click="{checkForUpdate}" class="button is-small">Check for updates</button>
	</div>
 </div>

