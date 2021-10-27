/*
BUGS:
1. CMD+Q does not close the application, should it? :thinking_face
*/
require('./customEventListeners');

const {
	app,
	Tray,
	ipcMain,
	BrowserWindow,
	globalShortcut,
} = require('electron');

const {
	manageDock,
	getTrayIcon,
	handleEscapeCall,
	registerApplicationProtocol,
	handleExternalBrowserLinks,
	handleProtocolRedirect,
	getElectronSourceCode,
	getMainWindowProperties,
	handleCloseApp,
	handleQuitAppCall,
} = require('./utils');

const { createTray, destroyTrayWindow } = require('./tray');
const { registerGlobalShortcuts } = require('./shortcuts');

let tray = null;
let browserWindow = null;

function createWindow() {
	tray = new Tray(getTrayIcon());
	manageDock(app); //add this to init
	browserWindow = new BrowserWindow(
		getMainWindowProperties(process.platform)
	);
	browserWindow.loadURL(getElectronSourceCode());
	browserWindow.webContents.on('new-window', handleExternalBrowserLinks);
	// browserWindow.setWindowOpenHandler(handleExternalBrowserLinks);
}

app.on('ready', () =>
	setTimeout(() => {
		createWindow();
		createTray(tray);
		registerApplicationProtocol(app);
		registerGlobalShortcuts(tray, globalShortcut, browserWindow);

		browserWindow.on('close', function (event) {
			event.preventDefault();
			browserWindow.hide();
		});
		// browserWindow.on('blur', () => {
		// 	if (!browserWindow.webContents.isDevToolsOpened()) {
		// 		browserWindow.hide();
		// 	}
		// });
	}, 400)
);

app.on('open-url', (event, url) =>
	handleProtocolRedirect(browserWindow, event, url)
);

ipcMain.on('close-by-escape-message', (event) => {
	handleEscapeCall(browserWindow).then((response) => {
		event.reply('close-by-escape-reply', response);
	});
});

ipcMain.on('show-app-message', () => {
	browserWindow.isVisible() ? browserWindow.hide() : browserWindow.show();
});

ipcMain.on('close-app-message', () => {
	browserWindow.destroy();
	destroyTrayWindow();
	app.quit();
});
