import './spotlight.css';
import React, { useEffect, useState } from 'react';

import { getToken } from '../../utils/common';

import Search from '../../components/search';
import Setting from '../../components/setting';
import Resizer from '../../utils/resizer';

function Spotlight({ redirectToSettings }) {
	const token = getToken();
	const [settingOpen, setSettingOpen] = useState(redirectToSettings);

	useEffect(() => {
		Resizer({ setting: settingOpen });
	}, [settingOpen]);

	return (
		<div className='mp-spotlight'>
			{!settingOpen && (
				<Search token={token} setSettingOpen={setSettingOpen} />
			)}
			{settingOpen && (
				<Setting token={token} setSettingOpen={setSettingOpen} />
			)}
		</div>
	);
}

Spotlight.defaultProps = {
	redirectToSettings: false,
};

export default Spotlight;
