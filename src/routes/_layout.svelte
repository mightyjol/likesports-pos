<script>
	//TODO check here if online or not
	import { stores, goto, prefetchRoutes } from '@sapper/app'
	import { onMount } from 'svelte'
	import { local as settingsLocal } from '../stores/settings.js'
	import initStores from '../stores/init.js'

	let { session } = stores()

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
		/* UPDATE CHECKING */
		ipc.on('update-status', (e, msg) => {
			console.error(msg)
		});

		/* SETTINGS LOCAL */
		ipc.on('settings', (event, current) => {
			console.log('received settings', current)
			settingsLocal.update(s => current)
		})

		//init local settings
		ipc.send('get-settings')

		/* Load all other routes */
		prefetchRoutes().then(() => {
			isFetching = false
			isFinished()
		});

		/* FIREBASE LAZY LOADING - this is the best solution i found to allow ssr with firebase*/
		//keep in mind that this adds +-500kb to the iitial chunk
		let lazy = await import('../firebase/app.js')
		let firebase = lazy.default
		
		let db = firebase.firestore()
		let messaging = firebase.messaging()

		session.set({
			auth: firebase.auth(),
			firestore: db,
			firebase: firebase,
			messaging: messaging
		})

		/* USER LOG STATE */
		firebase.auth().onAuthStateChanged(user => {
			if (user) {
			 	db.collection('users').doc(user.uid).get()
			 	.then(async doc => {
			 		let userData = doc.data()
					session.update(s => {
						s.user = userData
						s.firestore = firebase.firestore().collection('clients').doc(userData.client_id)
						return s
					})

					await initStores()

					isInitializing = false
					isFinished()
				})
				.catch(e => {
					console.error(e)
				})
			} else {
				session
				.update(s => {
					s.user = undefined
					return s
				})
			 
				goto('/')
			}
		});

		//TODO implement this for multiple registers
		/* HANDLE MESSAGING */
		messaging.onMessage((payload) => {
			console.log('Message received. ', payload);
			// ...
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