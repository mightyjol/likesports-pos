const { ipcRenderer } = require('electron');
const { env } = require('./config/electron.js');
const settings = require('electron-settings');

window.isDev = env === 'dev';
window.ipc = ipcRenderer;
window.electronSettings = settings; 