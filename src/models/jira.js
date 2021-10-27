const axios = require('axios');
const { getAPIKEY, addSearchable, Searchable } = require('./base');

const MAX_RESULTS = 1000;
const API_URL = 'https://api.atlassian.com/ex/jira';

const getIssues = (JiraAccess) => {
	return axios
		.get(`${API_URL}/${JiraAccess.cloud_id}/rest/api/3/search`, {
			headers: {
				Authorization: `Bearer ${JiraAccess.access_token}`,
			},
			params: { maxResults: MAX_RESULTS },
		})
		.then((response) => {
			const issues = Searchable.fromSearchApi(response.data.issues);
			addSearchable(issues).then((allissues) => {
				console.log('we added all the issues');
				return allissues;
			});
		});
};

const getProjects = (JiraAccess) => {
	return axios
		.get(`${API_URL}/${JiraAccess.cloud_id}/rest/api/3/project`, {
			headers: {
				Authorization: `Bearer ${JiraAccess.access_token}`,
				Accept: 'application/json',
			},
		})
		.then((response) => {
			addSearchable(response.data).then((allprojects) => {
				console.log('we added all the jira projects');
				return allprojects;
			});
		});
};

const syncJira = () => {
	return getAPIKEY('jira').then((response) => {
		const JiraAccess = JSON.parse(response.data.replace(/'/g, '"'));
		try {
			Promise.allSettled([
				getIssues(JiraAccess),
				getProjects(JiraAccess),
			]).then((results) => {
				newResults = {};
				results.forEach((result, idx) => {});
				return TextTrackCueList;
			});
		} catch (error) {
			console.error('Exception with Promise Jira-syncJira(): ', error);
		}
	});
};

module.exports = {
	syncJira: syncJira,
};
