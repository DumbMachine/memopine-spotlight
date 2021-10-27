const axios = require('axios');
const { Searchable, addSearchable, getAPIKEY } = require('./base');

const API_URL = 'https://api.figma.com/v1/files/';

const syncFigmaFile = (fileID) => {
	return getAPIKEY('figma').then((response) => {
		const figmaAccess = JSON.parse(response.data.replace(/'/g, '"'));
		return axios
			.get(API_URL + fileID, {
				headers: {
					Authorization: `Bearer ${figmaAccess.access_token}`,
				},
			})
			.then((response) => {
				Searchable.fromFigmaAPI(
					response.data['document'],
					response.data['name'],
					'https://www.figma.com/file/' + fileID
				).then((figmaNodes) => {
					addSearchable(figmaNodes).then((allNodes) => {
						console.log('we added all the figma nodes');
						return true;
					});
				});
			});
	});
};

const syncFigma = () => {
	// const fildIds = ['yc057LvJjD8Uc6MgHFtbGC'];
	// return fildIds.forEach((element) => {
	// 	return syncFigmaFile(element);
	// });
	return syncFigmaFile('yc057LvJjD8Uc6MgHFtbGC');
};

module.exports = {
	syncFigma: syncFigma,
};
