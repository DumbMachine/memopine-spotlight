const {
	connection,
	getAnything,
	addAnything,
	getAnythingAll,
} = require('./base');
const seedData = require('./default/defaultSettings.json');

const seedDataForSettings = {
	autoStart: { value: false, optionText: 'Start automagically with OS' },
	enableDarkMode: { value: true, optionText: 'Dark Mode' },
};

const REPO_NAME = 'IntegrationSettingSqlite';

function getIntegrationSettings() {
	return getAnythingAll(REPO_NAME);
}

function addIntegrationSetting(data) {
	return addAnything(data, REPO_NAME);
}

function updateISetting(data) {
	return connection.then((connection) => {
		const settings = connection.getRepository('IntegrationSettingSqlite');
		return settings
			.save({
				...data,
			})
			.then(() => {
				console.log(`Update Success ${'IntegrationSettingSqlite'}`);
			})
			.catch((error) => {
				console.error(`Update Failed ${'IntegrationSettingSqlite'}`);
			});
	});
}

getIntegrationSettings().then((response) => {
	if (response.length <= 0) {
		console.log('Trying to add things');
		addIntegrationSetting(seedData).then((_) => {
			console.log('added it');
		});
	}
});

module.exports = {
	updateISetting: updateISetting,
	addIntegrationSetting: addIntegrationSetting,
	getIntegrationSettings: getIntegrationSettings,
};
