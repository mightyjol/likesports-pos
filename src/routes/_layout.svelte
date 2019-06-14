<script>
	//TODO check here if online or not
	import { stores, goto, prefetchRoutes } from '@sapper/app'
	import { onMount } from 'svelte'
	
	export let segment
	
	let { session } = stores()
	let firebase = undefined

	//show loading before user state is set
	let isLoading = true
	let isInitializing = true
	let isFetching = true

	function isFinished(){
		if(!isFetching && !isInitializing) {
			isLoading = false				
		}
	}

	//checks if user is logged in already
	onMount(async () => {
		/* Load all other routes */
		/*
		prefetchRoutes().then(() => {
			isFetching = false
			isFinished()
		});
		*/
		isFetching = false

		/* FIREBASE LAZY LOADING - this is the best solution i found to allow ssr with firebase*/
		//keep in mind that this adds +-500kb to the iitial chunk
		let lazy = await import('../firebase/app.js')
		firebase = lazy.default

		session.update(s => {
			s.auth = firebase.auth()
			s.firestore = firebase.firestore()
			return s
		})

		/* USER LOG STATE */
		firebase.auth().onAuthStateChanged(user => {
			if (user) {
				session.update(s => {
					s.user = user
					return s
				})
			} else {
				session
				.update(s => {
					s.user = undefined
					return s
				})
			 
				goto('/')
			}
			
			isInitializing = false
			isFinished()
		});

		/* UPDATE CHECKING */
		ipc.on('update-status', (e, msg) => {
			console.error(msg)
		});
	})
</script>

<main>
	{#if isLoading}
		Loading
	{:else}
		<slot></slot>
	{/if}
</main>