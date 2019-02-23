const { app, BrowserWindow, ipcMain } = require('electron')
const { autoUpdater } = require('electron-updater');
const path = require('path');
const os = require('os');
const isDev = require('electron-is-dev');

const config = require('./config/default');
process.env.NODE_ENV = config.env;

const currentOs = os.type();
const isLinux = currentOs == 'Linux';

let win = undefined;

function createWindow () {

  win = new BrowserWindow({ 
  	width: 800, 
  	height: 600,
    webPreferences: {
      nodeIntegration: false,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  win.loadFile('./dist/index.html');
  if(isDev) win.webContents.openDevTools();

  win.webContents.on('crashed', (e) => {
    app.relaunch()
    win.webContents.send('isQuitting', true);
  });
  
  win.on('closed', () => {
    win = null;
  })
}

app.on('ready', function(){
  createWindow();
});

app.on('before-quit', function(){
  win.webContents.send('isQuitting', true);
});

/******************/
/*      IPC       */
/******************/

ipcMain.on('checkForUpdate', () =>{
  autoUpdater.checkForUpdates();
});

ipcMain.on('crash', (event, message) => {
  console.error('fake crash');
  process.crash();
});

ipcMain.on('canQuit', (event, message) => {
  app.exit(0)
});

/******************/
/*  Auto updater  */
/******************/

autoUpdater.on('checking-for-update', () => {
  sendStatusToWindow('Recherche de mise à jour');
})

autoUpdater.on('update-available', (info) => {
  sendStatusToWindow('Update available.');
})

autoUpdater.on('update-not-available', (info) => {
  sendStatusToWindow('Pas de mise à jour', true);
})

autoUpdater.on('error', (err) => {
  sendStatusToWindow('Error in auto-updater. ' + err);
})

autoUpdater.on('download-progress', (progressObj) => {
  let log_message = "Download speed: " + progressObj.bytesPerSecond;
  log_message = log_message + ' - Downloaded ' + progressObj.percent + '%';
  log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')';
  sendStatusToWindow(log_message);
})

autoUpdater.on('update-downloaded', (info) => {
  sendStatusToWindow('Update downloaded');
  autoUpdater.quitAndInstall();
});

function sendStatusToWindow(text, isReady = false) {
  win.webContents.send('updateStatusText', text);
  if(isReady){
     win.webContents.send('updateStatus', true); 
  }
}

/* MAC OS */

app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow();
  }
});


