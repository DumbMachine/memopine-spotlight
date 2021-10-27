const typeorm = require('typeorm');
const { Like } = require('typeorm');
const path = require('path');
const isDev = require('electron-is-dev');
const Record = require('dataclass');

const DB_LOC = isDev
	? path.join(__dirname, './db.sqlite3')
	: path.join(process.resourcesPath, 'db.sqlite3');

class UserSqlite extends Record {
	name = 'Anonymous';
	age = 0;
}

class IntegrationSettingSqlite extends Record {
	authenticated;
	serviceName;
	helperText;
	authenticateUrl;
	deAuthenticateUrl;
}

const getConnection = () => {
	return typeorm.createConnection({
		type: 'sqlite',
		database: DB_LOC,
		logging: true,
		entities: [
			new typeorm.EntitySchema(require('./demo.json')),
			new typeorm.EntitySchema(
				require('./integrationSettingSqlite.json')
			),
			new typeorm.EntitySchema(require('./zoomAPI.json')),
			new typeorm.EntitySchema(require('./zoomMeeting.json')),
			new typeorm.EntitySchema(require('./jiraAPI.json')),
		],
		synchronize: true,
	});
};

const connection = getConnection();

function getAnythingAll(repositoryName) {
	return connection.then((connection) => {
		const repo = connection.getRepository(repositoryName);
		return repo.find();
	});
}
function getAnything(repositoryName) {
	return connection.then((connection) => {
		const repo = connection.getRepository(repositoryName);
		return repo.findOne();
	});
}

function addAnything(data, repositoryName) {
	return connection.then((connection) => {
		const repo = connection.getRepository(repositoryName);
		return repo.save(data).then((savedPost) => {
			console.log(`Saved Things in ${repositoryName}`, data);
			return savedPost;
		});
	});
}

//  Zoomkeys
function addZoomAPIKeys(data) {
	return addAnything(data, 'ZoomAPIKeys');
}

function getZoomAPIKeys() {
	return getAnything('ZoomAPIKeys');
}

//  ZoomMeetings
function addZoomMeetings(data) {
	return addAnything(data, 'ZoomMeetings');
}

function getZoomMeetings() {
	return getAnything('ZoomMeetings');
}

function searchZoomMeetings(text) {
	return connection.then((connection) => {
		const repo = connection.getRepository('ZoomMeetings');
		return repo.find({
			topic: Like(`%${text}%`),
		});
	});
}

//  Jirakeys
function addJiraAPIKeys(data) {
	return addAnything(data, 'JiraAPIKeys');
}

function getJiraAPIKeys() {
	return getAnything('JiraAPIKeys');
}

// === === ===

function addIntegrationSetting(data) {
	return addAnything(data, 'IntegrationSettingSqlite');
}

// Update an integration setting
function updateISetting(data) {
	return connection.then((connection) => {
		const settings = connection.getRepository('IntegrationSettingSqlite');
		return settings
			.save({
				...data,
			})
			.then((savedPost) => {
				return savedPost;
			});
	});
}

const seedData = [
	{
		authenticated: false,
		serviceName: 'zoom',
		helperText: 'Find more about this integration at <link/to/docs/zoom>',
		authenticateUrl: 'http://localhost:8000/zoom/authorize',
		deAuthenticateUrl:
			'https://stackoverflow.com/questions/31749625/make-a-link-from-electron-open-in-browser',
	},
	{
		authenticated: false,
		serviceName: 'googleEmail',
		helperText: 'Find more about this integration at <link/to/docs/zoom>',
		authenticateUrl: 'http://localhost:8000/google/authorize',
		deAuthenticateUrl:
			'https://stackoverflow.com/questions/31749625/make-a-link-from-electron-open-in-browser',
	},
];

function getIntegrationSettings() {
	return connection.then((connection) => {
		const settings = connection.getRepository('IntegrationSettingSqlite');
		return settings.find();
	});
}

getIntegrationSettings().then((response) => {
	if (response.length <= 0) {
		addIntegrationSetting(seedData);
	}
});

function addGoogleAPIKeys() {
	return;
}

function addApiKeys(serviceName, data) {
	const mapping = {
		zoom: addZoomAPIKeys,
		jira: addJiraAPIKeys,
	};
	if (!Object.keys(mapping).includes(serviceName)) {
		throw Error('InvalidServiceName');
	}
	const fn = mapping[serviceName];
	return fn(data);
}

module.exports = {
	connection: connection,
	updateISetting: updateISetting,
	getIntegrationSettings: getIntegrationSettings,
	setIntegrationSettings: null,
	getZoomAPIKeys: getZoomAPIKeys,
	addZoomMeetings: addZoomMeetings,
	getZoomMeetings: getZoomMeetings,
	searchZoomMeetings: searchZoomMeetings,
	addApiKeys: addApiKeys,
};
