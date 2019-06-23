const { app, BrowserWindow, shell, ipcMain, Menu, autoUpdater } = require('electron');
const path = require('path');
const child = require('child_process').execFile;
const settings = require('electron-settings')

const config = require('./config/dev.json')
const basepath = process.env['APP_PATH'] = app.getAppPath();
const dev = process.env.NODE_ENV === 'development';
const url = dev ? config.server.dev : config.server.prod;

require('./updater.js');  

let mainWindow
let productWindows = []

createWindow = (preload = true) => {
	let webPreferences = {
		nodeIntegration: false
	}

	if(preload) webPreferences.preload = path.join(__dirname, '/preload.js')

	let newWindow = new BrowserWindow({
		backgroundColor: '#FFFFFF',
		minWidth: 375,
		show: false,
		titleBarStyle: 'hiddenInset',
		webPreferences: webPreferences,
		height: 860,
		width: 1280,
	});

	return newWindow
}

createMainWindow = () => {
	mainWindow = createWindow()
	mainWindow.loadURL(url)


	if(dev) mainWindow.webContents.openDevTools();
	
	mainWindow.once('ready-to-show', () => {
		mainWindow.show();

		//TODO figure out what this is for
		ipcMain.on('open-external-window', (event, arg) => {
			shell.openExternal(arg);
		});
	});
};

app.on('ready', () => {
	createMainWindow();
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

/* 
	PRINTERS 
*/

ipcMain.on('get-printers', (event, args) => {
	let printers = mainWindow.webContents.getPrinters()
	mainWindow.webContents.send('printers', printers);
})

ipcMain.on('set-printer', (event, args) => {
	let { type, deviceName } = args

	let key = 'printers.' + type
	console.error('setting', key, deviceName)
	settings.set(key, {
		name: deviceName
	});
	mainWindow.webContents.send('settings', settings.getAll());
})

ipcMain.on('print', (event, args) => {
	let { type, deviceName } = args
	let printExe = path.join(__dirname, '/external/ptp.exe')
	let pdfPath = path.join(__dirname, '/external/test.pdf')

	//prints silently
	/*
	child(printExe, [pdfPath], function(err, data) {
	     console.log(err)
	     console.log(data.toString());
	});
	*/
})


/*
	SETTINGS
*/
ipcMain.on('get-settings', (event, args) => {
	let current = settings.getAll()

	if(!current.inventories) {
		settings.set('inventories', [])
		current.inventories = []
	}

	mainWindow.webContents.send('settings', current)
})


ipcMain.on('physical-inventory-add', (event, args) => {
	let temp = settings.get('inventories')
	if(temp.indexOf(args.id) == -1){
		temp.push(args.id)
		settings.set('inventories', temp)
	}
	
	let current = settings.getAll()
	mainWindow.webContents.send('settings', current)
})


ipcMain.on('physical-inventory-remove', (event, args) => {
	let temp = settings.get('inventories')
	if(temp.indexOf(args.id) !== -1){
		temp.splice(temp.indexOf(args.id), 1)
		settings.set('inventories', temp)
	}
	
	let current = settings.getAll()
	mainWindow.webContents.send('settings', current)
})

/*
	WINDOWS
*/

ipcMain.on('window-product', (event, args) => {
	let id = args.id
	let productUrl = url + 'shop/products/' + id

	let newProductWindow = createWindow()
	newProductWindow.loadURL(productUrl)

	productWindows.push(newProductWindow)
	
	if(dev) newProductWindow.webContents.openDevTools();
	newProductWindow.once('ready-to-show', () => {
		newProductWindow.show();
	});
})