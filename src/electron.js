const { app, BrowserWindow, shell, ipcMain, Menu, autoUpdater } = require('electron');

let mainWindow;

process.on('uncaughtException', function (error) {
    // Handle the error
    mainWindow.webContents.send('error', {
		error: error
	});
});

require('./updater.js'); 

const basepath = process.env['APP_PATH'] = app.getAppPath();

const path = require('path');
const dev = process.env.NODE_ENV === 'development';

if(!dev){
	let p = path.resolve(__dirname, '../__sapper__/build/index.js');
	require(p);
}

createWindow = () => {
	mainWindow = new BrowserWindow({
		backgroundColor: '#FFFFFF',
		minWidth: 375,
		show: false,
		titleBarStyle: 'hiddenInset',
		webPreferences: {
			nodeIntegration: false,
			preload: path.join(__dirname, '/preload.js'),
		},
		height: 860,
		width: 1280,
	});

	mainWindow.loadURL('http://localhost:3000');
	mainWindow.webContents.openDevTools();
	
	mainWindow.once('ready-to-show', () => {
		mainWindow.show();

		ipcMain.on('open-external-window', (event, arg) => {
			shell.openExternal(arg);
		});
	});
};

app.on('ready', () => {
	createWindow();
});

app.on('window-all-closed', () => {
	app.quit();
});

app.on('activate', () => {
	if (mainWindow === null) {
		createWindow();
	}
});

ipcMain.on('load-page', (event, arg) => {
	mainWindow.loadURL(arg);
});

/*
	AUTO UPDATER
*/

ipcMain.on('check-for-update', (event, err) => {
	if(dev){
		mainWindow.webContents.send('update-status', {
			status: false,
			msg: 'This is a dev build',
			error: undefined
		});
	}
	else{
		autoUpdater.checkForUpdates();
	}
});

autoUpdater.on('update-available', (event, err) => {
	mainWindow.webContents.send('update-status', {
		status: true,
		msg: 'Update is available',
		error: err
	});
});

autoUpdater.on('update-not-available', (event, err) => {
	mainWindow.webContents.send('update-status', {
		status: false,
		msg: 'No update has been found',
		error: err
	});
});