const { ipcRenderer } = require('electron')
const PouchDb = require('pouchdb')

window.ipc = ipcRenderer
window.local = {
	lastupdate: new PouchDb('lastupdate'),
	payments: new PouchDb('payments'),
	register: new PouchDb('register'),
	products: new PouchDb('products')
}

//TODO add local settings here
