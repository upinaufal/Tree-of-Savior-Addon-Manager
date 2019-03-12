'use strict';
const electron = require('electron');
const app = electron.app;  // Module to control application life.
const BrowserWindow = electron.BrowserWindow;  // Module to create native browser window.

const bot = require('./scripts/discordbot').discordbot  // Module to control Discord bot.

// AutoUpdater ignore first time update.
//  see => https://github.com/electron/windows-installer#handling-squirrel-events
//      => https://github.com/mongodb-js/electron-squirrel-startup
if (require('electron-squirrel-startup')) app.quit();

// AutoUpdater
require('update-electron-app')({
  repo: 'JTosAddon/Tree-of-Savior-Addon-Manager',
  // repo: 'weizlogy/Addons',
  updateInterval: '1 hour',
})

// Report crashes to our server.
// electron.crashReporter.start();

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

// Quit when all windows are closed.
app.on('window-all-closed', function() {
	// On OS X it is common for applications and their menu bar
	// to stay active until the user quits explicitly with Cmd + Q
	if (process.platform != 'darwin') {
		app.quit();
	}
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', function() {
	// Create the browser window.
	mainWindow = new BrowserWindow({width: 1024+100, height: 768, icon: 'resources/tos-exp-mod.ico'});

	mainWindow.setMenuBarVisibility(false);

	mainWindow.setTitle("Tree of Savior Addon Manager");

	// and load the index.html of the app.
	mainWindow.loadURL(`file://${__dirname}/index.html`);

	// Open the DevTools.
	// mainWindow.webContents.openDevTools();

	// Discord bot become to login state.
	bot.login()

	// Emitted when the window is closed.
	mainWindow.on('closed', function() {
		// Dereference the window object, usually you would store windows
		// in an array if your app supports multi windows, this is the time
		// when you should delete the corresponding element.
		mainWindow = null;
	});
});

// ========================================
// Inter-Process Communication Definitions.
const { ipcMain } = require('electron')

ipcMain.on('createIssue', (event, arg) => {
  bot.report(arg, (report) => {
		event.sender.send('createIssueSucceed', report)
	})
})
