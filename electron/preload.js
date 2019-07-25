const { ipcRenderer } = require('electron')
const PouchDb = require('pouchdb')

window.ipc = ipcRenderer
window.local = {
	payments: new PouchDb('payments'),
	register: new PouchDb('register')
}

//TODO add local settings here
