const { showTrayWindow } = require('./tray');

module.exports = {
	registerGlobalShortcuts: (tray, globalShortcut, browserWindow) => {
		globalShortcut.register('Alt+Space', () => {
			browserWindow.isVisible()
				? browserWindow.hide()
				: browserWindow.show();
		});
		globalShortcut.register('Command+Y', () => {
			showTrayWindow(tray);
		});
	},
};
