const { ipcRenderer } = require('electron');
const { env } = require('./config/default');

window.isDev = env === 'dev';
window.ipc = ipcRenderer;
 