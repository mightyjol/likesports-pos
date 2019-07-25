<script>
	//TODO check here if online or not
	import { stores, goto, prefetchRoutes } from '@sapper/app'
	import { onMount } from 'svelte'
	import { local as settingsLocal } from '../stores/settings.js'
	import initStores from '../stores/init.js'
	import Loader from '../components/utils/Loader.svelte'
	import config from '../../config/firebase.js';

	export let segment

	let skipper = process.dev ? '/shop' : '/shop'
	
	let { session } = stores()

	//show loading before user state is set
	let isInitializing = true
	let isFetching = true
	$: isLoading = isInitializing || isFetching

	//checks if user is logged in already
	onMount(async () => {
		let seg = segment || ''

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
		console.log('asking for local settings')
		ipc.send('get-settings')


		/* Load all other routes */
		//TODO find a way to hard-cache everything
		if(process.browser && seg.indexOf('local') === -1){
			if(process.dev) console.log('prefetching all routes')
			if(isFetching){
				prefetchRoutes()
				.then(() => {
					isFetching = false
				})
				.catch(e => { console.error(e) })
			}
		}
		else{
			isFetching = false
		}
		
		/* FIREBASE LAZY LOADING - this is the best solution i found to allow ssr with firebase*/
		//keep in mind that this adds +-500kb to the initial chunk
		//let lazy = await import('../firebase/app.js')
		//let firebase = lazy.default

		let app = firebase.initializeApp(config)

		let auth = app.auth()
		let db = app.firestore()
		let storage = app.storage()
		//let messaging = app.messaging()

		session.set({
			firebase: app,
			auth: auth,
			firestore: db,
			storage: storage,
			//messaging: messaging
		})

		/* USER LOG STATE */
		auth.onAuthStateChanged(user => {
			if (user) {
			 	db.collection('users').doc(user.uid).get()
			 	.then(async doc => {
			 		let userData = doc.data()

			 		if($session.isInitialized != true){
			 			console.log('session and stores initialisation')
			 			session.update(s => {
			 				s.isInitialized = true
							s.user = userData
							s.firestore = firebase.firestore().collection('clients').doc(userData.client_id)
							return s
						})
						
						await initStores()
			 		}
			 		else{
			 			if(process.dev) console.log('skipped session initialisation')
			 		}
					
					isInitializing = false

					if(seg.indexOf('local') === -1){
						goto(skipper)
					}
				})
				.catch(e => {
					console.error(e)
				})
			} else {
				session.update(s => {
					s.isInitialized = false
					s.user = undefined
					s.firestore = firebase.firestore
					return s
				})
			 	
			 	isInitializing = false
				goto('/')
			}
		});

		//TODO implement this for multiple registers
		/* HANDLE MESSAGING */
		/*
		messaging.onMessage((payload) => {
			console.log('Message received. ', payload);
			// ...
		});
		*/
	})
</script>
 
<main>
	{#if isLoading}
		<div class="hero is-fullheight">
			<div class="hero-body">
				<div class="container">
					<div class="columns is-vcentered is-centered">
						<div class="column has-text-centered is-narrow">
							Loading...
						</div>
					</div>
				</div>	
			</div>
		</div>
	{:else}
		<slot></slot>
	{/if}
</main>