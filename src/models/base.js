const path = require('path');
const typeorm = require('typeorm');
const { Like } = require('typeorm');
const isDev = require('electron-is-dev');

const DB_LOC = isDev
	? path.join(__dirname, './db.sqlite3')
	: path.join(process.resourcesPath, 'db.sqlite3');

function findValues(obj, key) {
	return new Promise((resolve) => {
		resolve(findValuesHelper(obj, key, []));
	});
}

function findValuesHelper(obj, keys, list) {
	if (!obj) return list;
	if (obj instanceof Array) {
		for (var i in obj) {
			list = list.concat(findValuesHelper(obj[i], keys, []));
		}
		return list;
	}
	const allKeysPresent = keys.every((key) => Object.keys(obj).includes(key));
	if (allKeysPresent) {
		const someItem = {};
		keys.forEach((element) => {
			someItem[element] = obj[element];
		});
		list.push(someItem);
	}

	if (typeof obj == 'object' && obj !== null) {
		var children = Object.keys(obj);
		if (children.length > 0) {
			for (i = 0; i < children.length; i++) {
				list = list.concat(
					findValuesHelper(obj[children[i]], keys, [])
				);
			}
		}
	}
	return list;
}

class Searchable {
	constructor(titleText, contentText, targetUrl, mimeType, serviceName) {
		this.titleText = titleText;
		this.contentText = contentText;
		this.targetUrl = targetUrl;
		this.mimeType = mimeType;
		this.serviceName = serviceName;
	}
	static fromJiraApi(issues) {
		return issues.map((issue) => {
			const tempUrl = new URL(issue.self);
			return {
				titleText: issue.fields.summary,
				contentText: 'null',
				targetUrl:
					tempUrl.protocol + '//' + tempUrl.host + '/' + issue.id,
				mimeType: 'issue',
				serviceName: 'jira',
			};
		});
	}
	static fromZoomApi(meetings) {
		return meetings.map((meet) => {
			return {
				titleText: meet.topic,
				contentText: meet.agenda,
				targetUrl: meet.join_url,
				mimeType: 'meeting',
				serviceName: 'zoom',
			};
		});
	}
	static fromJiraProjectsAPI(projects) {
		return projects.map((project) => {
			return {};
		});
	}
	static fromGithubRepoAPI(repos) {
		return repos.map((repo) => {
			return {
				titleText: repo.full_name,
				contentText: repo.description || 'No description',
				targetUrl: repo.html_url,
				mimeType: 'repository',
				serviceName: 'github',
			};
		});
	}
	static fromGithubIssuesAPI(issues) {
		return issues.map((issue) => {
			return {
				titleText: issue.title || 'No title',
				contentText: issue.body || 'No description',
				targetUrl: issue.html_url,
				mimeType: 'issue',
				serviceName: 'github',
			};
		});
	}
	static fromFigmaAPI(figmaNodes, projectName, projectBaseUrl) {
		return findValues(figmaNodes, ['name', 'type', 'id']).then((nodes) => {
			return nodes.map((node) => {
				return {
					titleText: projectName + ': ' + node.name,
					contentText: node.type,
					targetUrl: projectBaseUrl + '?node-id=' + node.id,
					mimeType: 'node',
					serviceName: 'figma',
				};
			});
		});
	}
}

const getConnection = () => {
	return typeorm.createConnection({
		type: 'sqlite',
		database: DB_LOC,
		// logging: true,
		entities: [
			new typeorm.EntitySchema(require('./entities/APIKey.json')),
			new typeorm.EntitySchema(require('./entities/searchable.json')),
			new typeorm.EntitySchema(
				require('./entities/integrationSettingSqlite.json')
			),
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
const API_REPO_NAME = 'APIKey';
const SEARCH_REPO_NAME = 'Searchable';

function getAPIKEY(serviceName, repositoryName = API_REPO_NAME) {
	return connection.then((connection) => {
		const repo = connection.getRepository(repositoryName);
		return repo.findOne({ serviceName: serviceName });
	});
}
function addAPIKEY(data, repositoryName = API_REPO_NAME) {
	return connection.then((connection) => {
		const repo = connection.getRepository(repositoryName);
		return repo.save(data).then((savedPost) => {
			console.log(`Saved Things in ${repositoryName}`);
			return savedPost;
		});
	});
}

function getSearchable() {
	return getAnything(SEARCH_REPO_NAME);
}

function addSearchable(data) {
	return addAnything(data, SEARCH_REPO_NAME);
}

function searchSearchable(text) {
	return connection.then((connection) => {
		const repo = connection.getRepository(SEARCH_REPO_NAME);
		return repo.find({
			titleText: Like(`%${text}%`),
		});
	});
}

module.exports = {
	connection: connection,
	addAnything: addAnything,
	getAnything: getAnything,
	getAnythingAll: getAnythingAll,
	Searchable: Searchable,
	addAPIKEY: addAPIKEY,
	getAPIKEY: getAPIKEY,
	getSearchable: getSearchable,
	addSearchable: addSearchable,
	searchSearchable: searchSearchable,
};
