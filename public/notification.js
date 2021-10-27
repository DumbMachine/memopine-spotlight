const { Notification } = require('electron');

const NOTIF_TYPES = {
	google_meet: {},
	zoom_meet: {},
};

module.exports = {
	createNotification: (title, body) => {
		// return new Notification({ title, body });
		const notif = new Notification({ title, body });
		notif.on('click', () => {
			console.log('this thing was clicked');
		});
	},
};
