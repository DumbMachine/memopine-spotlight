const axios = require('axios');
const { Searchable, addSearchable } = require('./base');

const API_URL = 'https://api.zoom.us/v2/users/me/meetings';

function syncGoogle() {
	return getZoomAPIKeys().then((response) => {
		const zoomAccess = JSON.parse(response.data.replace(/'/g, '"'));
		console.log('zoomaccess: ', zoomAccess);
		return axios
			.get(API_URL, {
				headers: {
					Authorization: `Bearer ${zoomAccess.access_token}`,
				},
				params: { type: 'scheduled' },
			})
			.then((response) => {
				const meetings = Searchable.fromZoomApi(response.data.meetings);
				addSearchable(meetings).then((allmeetings) => {
					console.log('We addeda all the meetings');
					return allmeetings;
				});
			});
	});
}

module.exports = {
	syncGoogle: syncGoogle,
};
