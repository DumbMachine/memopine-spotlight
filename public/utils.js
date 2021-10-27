const path = require('path');
const electron = require('electron');
const { Notification } = require('electron');
const { nativeTheme } = require('electron');
const isDev = require('electron-is-dev');

const { addAPIKEY } = require('../src/models/base');
const { syncZoom } = require('../src/models/zoom');
const { syncFigma } = require('../src/models/figma');
const { syncJira } = require('../src/models/jira');
const { syncGithub } = require('../src/models/github');
const { resolve } = require('path');
const { reject } = require('any-promise');

const APP_URL_SLUG = 'memopine';

const TRAY_ICONS = {
	win32: {
		dark: 'icon-dark@2x.ico',
		light: 'icon-light@2x.ico',
		dark_notif: 'icon-dark-notif@2x.ico',
		light_notif: 'icon-light-notif@2x.ico',
	},
	darwin: {
		dark: 'icon-dark-16.png',
		light: 'icon-light-16.png',
		dark_notif: 'icon-dark-notif-16.png',
		light_notif: 'icon-light-notif-16.png',
	},
	default: {
		dark: 'icon-dark-16.png',
		light: 'icon-light-16.png',
		dark_notif: 'icon-dark-notif-16.png',
		light_notif: 'icon-light-notif-16.png',
	},
};

const NOTIF_EVENTS = {
	update: {
		title: 'Panic',
		icon: null,
		body: ' You has update, so update or I go rogue',
	},
	error: {
		title: 'Panic',
		icon: null,
		body: 'I has a error without fallback, blame imcompetent devs',
	},
};

module.exports = {
	// tray things:
	/**
	 * Quit app when called from tray
	 */
	handleQuitAppCall: (app, browserWindow, trayWindow) => {
		browserWindow.destroy();
		trayWindow.destroy();
		app.quit();
	},
	handleCloseApp: (app, trayWindow) => {
		browserWindow.destroy();
		trayWindow !== null && trayWindow.destroy();
		app.quit();
	},
	isElectronDev: (app) => {
		return !app.isPackaged;
	},
	isDev: isDev,
	manageDock: (app) => {
		if (process.platform == 'darwin') {
			app.dock.hide();
		}
		// TODO: dock hide windows
	},
	getTrayIcon: () => {
		const platformName = !Object.keys(TRAY_ICONS).includes(process.platform)
			? 'default'
			: process.platform;
		const themeName = nativeTheme.shouldUseDarkColors ? 'dark' : 'light';

		return path.join(
			__dirname,
			'icons',
			TRAY_ICONS[platformName][themeName]
		);
	},
	createNotification: (tray, notifEventName = null, justIcon = false) => {
		const platformName = !Object.keys(TRAY_ICONS).includes(process.platform)
			? 'default'
			: process.platform;
		const themeName = nativeTheme.shouldUseDarkColors
			? 'dark_notif'
			: 'light_notif';

		tray.setImage(
			path.join(__dirname, 'icons', TRAY_ICONS[platformName][themeName])
		);
		if (justIcon) {
			const event = NOTIF_EVENTS[notifEventName];
			const notif = {
				title: event.title,
				body: event.body,
				// icon: tray.icon,
			};
			new Notification(notif).show();
		}
	},
	registerApplicationProtocol: (app) => {
		if (process.defaultApp) {
			if (process.argv.length >= 2) {
				app.setAsDefaultProtocolClient(APP_URL_SLUG, process.execPath, [
					path.resolve(process.argv[1]),
				]);
			}
		} else {
			app.setAsDefaultProtocolClient(APP_URL_SLUG);
		}
	},

	handleExternalBrowserLinks: (e, url) => {
		e.preventDefault();
		electron.shell.openExternal(url);
	},
	handleProtocolRedirect: (window, _, url) => {
		const urlString = new URL(url);
		const urlSomethign = new URL(urlString);
		const serviceName = urlSomethign.searchParams.get('serviceName');
		const accessToken = urlSomethign.searchParams.get('data');

		addAPIKEY({
			data: accessToken,
			serviceName: serviceName,
		}).then((_) => console.log('Keys saved for: ', serviceName));

		console.log('we recievd a redirecT: ');
		window.webContents.send('redirect-status-reply', true);
	},
	getElectronSourceCode: () => {
		return isDev
			? 'http://localhost:3000'
			: `file://${path.join(__dirname, '../build/index.html')}`;
	},
	/**
	 * Handle sync jobs from renderer
	 * Returns completion time upon success, raises otherwise
	 */
	handleSyncCall: (serviceName) => {
		return new Promise((resolve, reject) => {
			const mapping = {
				zoom: syncZoom,
				jira: syncJira,
				figma: syncFigma,
				github: syncGithub,
				errorFn: () => {
					return false;
				},
			};
			if (!Object.keys(mapping).includes(serviceName)) {
				reject(new Error('Invalid serviceName: '));
			}
			resolve(mapping[serviceName]);
		});
	},
	handleEscapeCall: (window) => {
		return new Promise((resolve) => {
			window.hide();
			resolve(true);
		});
	},
	/**
	 * Platform specific properties
	 */
	getMainWindowProperties: (platform) => {
		switch (platform) {
			case 'darwin':
				return {
					width: 840,
					maxHeight: 575,
					resizable: false,
					hasShadow: false,
					show: false,
					// show: true,
					transparent: true,
					frame: false,
					useContentSize: true,
					webPreferences: {
						devTools: true,
						nodeIntegration: true,
						enableRemoteModule: true,
						contextIsolation: false,
						preload: __dirname + '/preload.js',
					},
				};
			case 'linux':
				return {
					width: 840,
					maxHeight: 575,
					resizable: true,
					hasShadow: false,
					show: true,
					transparent: true,
					frame: false,
					useContentSize: true,
					webPreferences: {
						devTools: true,
						nodeIntegration: true,
						enableRemoteModule: true,
						contextIsolation: false,
						preload: __dirname + '/preload.js',
					},
				};
			default:
				return {
					width: 840,
					maxHeight: 575,
					resizable: false,
					hasShadow: false,
					show: true,
					transparent: false,
					frame: false,
					backgroundColor: 'white',
					useContentSize: true,
					webPreferences: {
						devTools: true,
						nodeIntegration: true,
						enableRemoteModule: true,
						contextIsolation: false,
						preload: __dirname + '/preload.js',
					},
				};
		}
	},
};

// app.setPath(
//   "userData",
//   isDev
//     ? path.join(app.getAppPath(), "userdata/") // In development it creates the userdata folder where package.json is
//     : path.join(process.resourcesPath, "userdata/") // In production it creates userdata folder in the resources folder
// );
