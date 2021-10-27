/*
Tray handler
*/

const path = require('path');
const { BrowserWindow } = require('electron');
const { isDev, handleExternalBrowserLinks } = require('./utils');

let trayWindow = null;

const getTraySourceCode = () => {
	return isDev
		? 'http://localhost:3000/tray'
		: `file://${path.join(__dirname, '../build/index.html')}`;
};

const getWindowPositionForTray = (tray) => {
	const windowBounds = trayWindow.getBounds();
	const trayBounds = tray.getBounds();

	// Center window horizontally below the tray icon
	const x = Math.round(
		trayBounds.x + trayBounds.width / 2 - windowBounds.width / 2
	);

	// Position window 4 pixels vertically below the tray icon
	const y = Math.round(trayBounds.y + trayBounds.height + 4);

	return { x: x, y: y };
};

const toggleTrayWindow = (tray) => {
	trayWindow.isVisible() ? trayWindow.hide() : showTrayWindow(tray);
};

const showTrayWindow = (tray) => {
	const position = getWindowPositionForTray(tray);
	trayWindow.setPosition(position.x, position.y, false);
	trayWindow.show();
};

function createTrayWindow() {
	trayWindow = new BrowserWindow({
		width: 340,
		height: 440,
		show: false,
		frame: false,
		fullscreenable: false,
		resizable: false,
		transparent: true,
		webPreferences: {
			backgroundThrottling: false,
			devTools: true,
			nodeIntegration: true,
			enableRemoteModule: true,
			contextIsolation: false,
			// contextIsolation: true,
			preload: __dirname + '/preload.js',
		},
	});
	trayWindow.loadURL(getTraySourceCode());
	trayWindow.webContents.on('new-window', handleExternalBrowserLinks);

	trayWindow.on('close', function (event) {
		event.preventDefault();
		trayWindow.hide();
	});
	trayWindow.on('blur', () => {
		if (!trayWindow.webContents.isDevToolsOpened()) {
			trayWindow.hide();
		}
	});
}

function createTray(tray) {
	createTrayWindow();
	tray.on('click', () => {
		toggleTrayWindow(tray);
	});

	tray.setToolTip('Memopine traybar. The best bar');
}

function destroyTrayWindow() {
	trayWindow.destroy();
}

module.exports = {
	createTray,
	trayWindow, // not sure if this is the right way of doing this
	showTrayWindow,
	destroyTrayWindow,
};
