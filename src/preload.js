const {ipcRenderer} = require('electron');

window.ipc = ipcRenderer;

ipcRenderer.on('error', (e, msg) => {
	console.error(msg)
});