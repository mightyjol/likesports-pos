const { app, BrowserWindow } = require('electron')
const { autoUpdater } = require("electron-updater");

let win = undefined;

function createWindow () {

  win = new BrowserWindow({ 
  	width: 800, 
  	height: 600,
    webPreferences: {
      nodeIntegration: false
    }
  });

  win.loadFile('index.html');
  win.webContents.openDevTools();

  win.on('closed', () => {
    win = null;
  })
}

app.on('ready', function(){
  createWindow();
  autoUpdater.checkForUpdates();
});

///////////////////
// Auto updater //
///////////////////

autoUpdater.on('checking-for-update', () => {
  sendStatusToWindow('Checking for update...');
})

autoUpdater.on('update-available', (info) => {
  sendStatusToWindow('Update available.');
})

autoUpdater.on('update-not-available', (info) => {
  sendStatusToWindow('Update not available.');
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
});

function sendStatusToWindow(text) {
  console.log(text);
  //win.webContents.send('message', text);
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


autoUpdater.checkForUpdates();