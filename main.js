const { app, BrowserWindow, ipcMain } = require('electron')
const { autoUpdater } = require('electron-updater');
const path = require('path');
const os = require('os');
const isDev = require('electron-is-dev');
const PDFWindow = require('electron-pdf-window');

const settings = require('electron-settings');
const config = require('./config/default');
process.env.NODE_ENV = config.env;

const currentOs = os.type();
const isLinux = currentOs == 'Linux';

let win = undefined;
let POS = undefined;

let testPrint = undefined;

function createWindow () {

  win = new BrowserWindow({ 
  	width: 1024, 
  	height: 800,
    minWidth: 320,
    webPreferences: {
      nodeIntegration: false,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  win.setMenuBarVisibility(false);

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

function sendPrintersDefault (){
  def = {
    a4: {
      type: 'A4',
      name: undefined
    },
    ticket: {
      type: 'ticket',
      name: undefined
    }
  }

  if(settings.has('printers.a4')) def.a4.name = settings.get('printers.a4')
  if(settings.has('printers.ticket')) def.ticket.name = settings.get('printers.ticket')

  win.webContents.send('printersDefault', def)
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

//windows
ipcMain.on('launchPOS', (e, name) => {
  console.log('launching pos window');
  POS = new BrowserWindow({ 
    width: 1024, 
    height: 800,
    minWidth: 320,
    webPreferences: {
      nodeIntegration: false,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  win.setMenuBarVisibility(false);

  win.loadFile('./dist/index.html');
  if(isDev) win.webContents.openDevTools();

  win.webContents.on('crashed', (e) => {
    app.relaunch()
    win.webContents.send('isQuitting', true);
  });
  
  win.on('closed', () => {
    win = null;
  })
});

//printers
ipcMain.on('getPrintersDefault', (event, name) =>{
  settings.set('printers.ticket', name)
  sendPrintersDefault()
});

ipcMain.on('setA4Printer', (event, name) =>{
  settings.set('printers.a4', name)
  sendPrintersDefault()
});

ipcMain.on('setTicketPrinter', (event, name) =>{
  settings.set('printers.ticket', name)
  sendPrintersDefault()
});

ipcMain.on('deletePrinter', (event, type) =>{
  settings.delete('printers.' + type.toLowerCase())
  sendPrintersDefault()
});

ipcMain.on('testPrinter', (event, type) =>{
  device = settings.get('printers.' + type.toLowerCase())

  testPrint = new PDFWindow({
    show: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  });

  // load PDF
  testPrint.loadURL(path.resolve(app.getAppPath(), 'static/print/test.pdf'));

  // if pdf is loaded start printing
  testPrint.webContents.on('dom-ready', () => {
    let code ='var interval = window.setInterval(function() {var pdf = pdfjsWebLibs.pdfjsWebApp.PDFViewerApplication;if(!pdf.pdfViewer.pageViewsReady) return; clearInterval(interval);window.print();}, 100);'
    testPrint.webContents.executeJavaScript(code)
  });
});

ipcMain.on('testPdfReady', (event) =>{
  console.error('print')
  testPrint.webContents.print({silent: true, deviceName: settings.get('printers.a4')})
});

ipcMain.on('getPrinters', () =>{
  let printers = win.webContents.getPrinters();
  win.webContents.send('printers', printers);
});

ipcMain.on('print', (config) =>{
  return;
});

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


