const axios = require('axios');
const { Searchable, getAPIKEY, addSearchable } = require('./base');

const API_URL = 'https://api.zoom.us/v2/users/me/meetings';

function syncZoom() {
	return getAPIKEY('zoom').then((response) => {
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
					return true;
				});
			})
			.catch((err) => {
				console.error('ZoomSync: ', err);
			});
	});
}

module.exports = {
	syncZoom: syncZoom,
};
