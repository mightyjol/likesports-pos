const { ipcRenderer } = require('electron');
const { env } = require('./config/electron.js');

window.isDev = env === 'dev';
window.ipc = ipcRenderer;
 