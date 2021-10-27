import './tray.css';

import MeetingTray from './googleMeet';
import { BiExit, BiShow } from 'react-icons/bi';
import {
	handleQuitApp,
	handleShowApp,
} from '../../components/setting/integration/ipcListeners';

/**
 * Meetings from sql, sorted by timeStamp
 * @returns
 */
const getMeetingsForTray = () => {
	return [
		{
			timeStamp: '11:09 PM',
			title: 'Zoom Memopine Tray',
			meetingType: 'goole_meet',
			targetLink:
				'https://us04web.zoom.us/s/77530186520?pwd=ZElkVys4cWh6bVlha1oyczRyNVl0Zz09#success',
		},
		{
			timeStamp: '11:09 PM',
			title: 'Google Memopine Tray',
			meetingType: 'zoom',
			targetLink:
				'https://us04web.zoom.us/s/77530186520?pwd=ZElkVys4cWh6bVlha1oyczRyNVl0Zz09#success',
		},
	];
};

function Tray(props) {
	// const meetings = getMeetingsForTray();
	const meetings = [
		{
			timeStamp: '5:09 PM',
			title: '🟢 TestPrep Discussion #1',
			meetingType: 'google_meet',
			targetLink: 'https://meet.google.com/vov-idrd-mru',
		},
	];

	return (
		<div className='mp-tray'>
			<div className='mp-tray-items'>
				{meetings.map((meet) => {
					return <MeetingTray {...meet} />;
				})}
			</div>
			<div className='mp-tray-options'>
				<div className='mp-tray-option'>
					<BiShow onClick={handleShowApp} />
				</div>
				<div className='mp-tray-option'>
					<BiExit onClick={handleQuitApp} />
				</div>
			</div>
		</div>
	);
}

export default Tray;
