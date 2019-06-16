import { get } from 'svelte/store'
import { stores } from '@sapper/app'
import { dist as settings, local as localSettings } from './settings.js'
import { store as inventories } from './inventories.js'

async function init(){
	let { session } = stores()
	let sessionData = get(session)

	let client_id = sessionData.user.client_id
	let db  = sessionData.firestore

	//todo get only settings if you have rights
	let tempSettings = []
	await db.collection('settings').get()
	.then(query => {
		query.forEach(doc => {
			let data = doc.data()
			data.id = doc.id
			tempSettings.push(data)
		})

		settings.set(tempSettings)
	})
	.catch(e => {
		console.error(e)
	})

	//todo get only inventories when you have read rights
	let tempInventories = []
	await db.collection('inventories').get()
	.then(query => {
		query.forEach(doc => {
			let data = doc.data()
			data.id = doc.id
			data.isPhysical = false

			let set = get(localSettings)
			if(set.inventories.indexOf(data.id) !== -1) data.isPhysical = true

			tempInventories.push(data)
		})

		inventories.set(tempInventories)
	})
	.catch(e => {
		console.error(e)
	})
}

export default init