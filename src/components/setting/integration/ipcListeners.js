const electron = window.require('electron');
const { ipcRenderer } = electron;

export function checkUserOnboarded() {
	return new Promise((resolve) => {
		ipcRenderer.once('checkUserOnboarded-reply', (_, arg) => {
			resolve(true);
		});
		ipcRenderer.send('checkUserOnboarded-message', null);
	});
}

export function checkRedirectOver(setAuthStatus) {
	return new Promise((resolve) => {
		ipcRenderer.once('redirect-status-reply', (_, arg) => {
			console.log('redirect solving: ', arg);
			resolve(arg);
		});
	});
}

export function getIntegrationSettings() {
	return new Promise((resolve) => {
		ipcRenderer.once('get-integration-settings-reply', (_, arg) => {
			resolve(arg);
		});
		ipcRenderer.send('get-integration-settings-message', null);
	});
}

export function updateIntegrationSettings(data) {
	return new Promise((resolve) => {
		ipcRenderer.once('update-integration-settings-reply', (_, arg) => {
			console.log('this was the updated thing', arg);
			resolve(arg);
		});
		ipcRenderer.send('update-integration-settings-message', data);
	});
}

export function triggerServiceSync(serviceName) {
	const service = {
		reply: 'sync-job-reply',
		message: 'sync-job-message',
	};

	return new Promise((resolve, reject) => {
		ipcRenderer.once(service.reply, (_, arg) => {
			switch (arg.status) {
				case true:
					resolve(arg);
				default:
					reject(arg);
			}
		});
		ipcRenderer.send(service.message, serviceName);
	});
}

export function triggerZoomSearch(text) {
	return new Promise((resolve) => {
		ipcRenderer.once('search-ui-reply', (_, arg) => {
			resolve(arg);
		});
		ipcRenderer.send('search-ui-message', text);
	});
}

export function escapeToClose() {
	return new Promise((resolve) => {
		ipcRenderer.once('close-by-escape-reply', (_, arg) => {
			resolve(arg);
		});
		ipcRenderer.send('close-by-escape-message');
	});
}

export function handleQuitApp() {
	// return new Promise((resolve) => {
	// 	ipcRenderer.once('close-by-escape-reply', (_, arg) => {
	// 		resolve(arg);
	// 	});
	// 	ipcRenderer.send('close-by-escape-message');
	// });
	ipcRenderer.send('close-app-message');
}

export function handleShowApp() {
	ipcRenderer.send('show-app-message');
}
