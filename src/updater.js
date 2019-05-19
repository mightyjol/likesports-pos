const { app, autoUpdater, dialog, ipcMain } = require('electron');

if (require('electron-squirrel-startup')) app.quit();
// if first time install on windows, do not run application, rather
// let squirrel installer do its work
let handleSquirrelEvent = function() {
	if (process.argv.length === 1) {
	  return false
	}

	const ChildProcess = require('child_process')
	const path = require('path')

	const appFolder = path.resolve(process.execPath, '..')
	const rootAtomFolder = path.resolve(appFolder, '..')
	const updateDotExe = path.resolve(path.join(rootAtomFolder, 'Update.exe'))
	const exeName = path.basename(process.execPath)

	const spawn = function(command, args) {
	  let spawnedProcess

	  try {
	    spawnedProcess = ChildProcess.spawn(command, args, { detached: true })
	  } catch (error) {
	    console.warn(error)
	  }

	  return spawnedProcess
	}

	const spawnUpdate = function(args) {
	  return spawn(updateDotExe, args)
	}

	const squirrelEvent = process.argv[1]
	switch (squirrelEvent) {
	  case '--squirrel-install':
	  case '--squirrel-updated':
	    // Optionally do things such as:
	    // - Add your .exe to the PATH
	    // - Write to the registry for things like file associations and
	    //   explorer context menus

	    // Install desktop and start menu shortcuts
	    spawnUpdate(['--createShortcut', exeName])

	    setTimeout(app.quit, 1000)
	    break

	  case '--squirrel-uninstall':
	    // Undo anything you did in the --squirrel-install and
	    // --squirrel-updated handlers

	    // Remove desktop and start menu shortcuts
	    spawnUpdate(['--removeShortcut', exeName])

	    setTimeout(app.quit, 1000)
	    break

	  case '--squirrel-obsolete':
	    // This is called on the outgoing version of your app before
	    // we update to the new version - it's the opposite of
	    // --squirrel-updated

	    app.quit()
	    break
	}
}

if (handleSquirrelEvent()) {
  	process.exit()
}

const config = require('./config/dev.json');
const server = config.update.server;
const feed = `${server}/update/${process.platform}/${app.getVersion()}`;

autoUpdater.setFeedURL(feed);

autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName) => {
	const dialogOpts = {
		type: 'info',
		buttons: ['Restart', 'Later'],
		title: 'Application Update',
		message: process.platform === 'win32' ? releaseNotes : releaseName,
		detail: 'A new version has been downloaded. Restart the application to apply the updates.'
	}

	dialog.showMessageBox(dialogOpts, (response) => {
		if (response === 0) autoUpdater.quitAndInstall()
	})
})