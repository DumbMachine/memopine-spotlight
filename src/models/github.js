const { getAPIKEY, Searchable, addSearchable } = require('./base');
const { Octokit } = require('@octokit/core');

const getToken = () => {
	return getAPIKEY('github').then((response) => {
		const accessToken = JSON.parse(response.data.replace(/'/g, '"'));
		return new Octokit({ auth: accessToken.access_token });
	});
};

const getRepoNames = (octokit) => {
	return octokit.request('GET /user/repos').then((response) => {
		const repos = Searchable.fromGithubRepoAPI(response.data);
		addSearchable(repos).then((allRepos) => {
			console.log('we added all the repos');
			return allRepos;
		});
	});
};

const getIssues = (octokit) => {
	return octokit.request('GET /issues').then((response) => {
		const issues = Searchable.fromGithubIssuesAPI(response.data);
		addSearchable(issues).then((allIssues) => {
			console.log('we added all the issues');
			return allIssues;
		});
	});
};
// sync the latest Jira
const syncGithub = () => {
	return getToken().then((octokit) => {
		try {
			Promise.allSettled([
				getRepoNames(octokit),
				getIssues(octokit),
			]).then((results) => {
				results;
			});
		} catch (error) {
			console.error(
				'Exception with Promise Github-syncGithub(): ',
				error
			);
		}
	});
};

module.exports = {
	syncGithub: syncGithub,
};
