const { ipcMain, BrowserWindow } = require('electron');
const { searchSearchable } = require('../src/models/base');
const {
	updateISetting,
	getIntegrationSettings,
} = require('../src/models/settings');

const { handleSyncCall } = require('./utils');

ipcMain.on('get-integration-settings-message', (event, arg) => {
	getIntegrationSettings().then((response) => {
		event.reply('get-integration-settings-reply', { data: response });
	});
});

ipcMain.on('update-integration-settings-message', (event, arg) => {
	updateISetting(arg).then((response) => {
		event.reply('update-integration-settings-reply', { data: response });
	});
});

ipcMain.on('sync-job-message', (event, serviceName) => {
	handleSyncCall(serviceName)
		.then((syncFn) => {
			syncFn().then(() => {
				event.reply('sync-job-reply', {
					status: true,
					timeFstamp: new Date(),
				});
			});
		})
		.catch((error) => {
			console.error('Failed job: ', error);
			event.reply('sync-job-reply', {
				status: false,
			});
		});
});

ipcMain.on('search-ui-message', (event, arg) => {
	searchSearchable(arg).then((response) => {
		event.reply('search-ui-reply', { data: response });
	});
});

ipcMain.on('resize-me-please', (event, { width, height }) => {
	let browserWindow = BrowserWindow.fromWebContents(event.sender);
	browserWindow.setSize(width, height);
});
