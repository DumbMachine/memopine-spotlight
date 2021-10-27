import './tray.css';

import { Button } from '../../components/button';
import { Link } from 'react-router-dom';

function MeetingTray({ timeStamp, title, meetingType, targetLink }) {
	console.log('We have these things: ', {
		timeStamp,
		title,
		meetingType,
		targetLink,
	});
	return (
		<div className='mp-tray-gm'>
			<div className='gm-info'>
				<span className='gm-timing'>{timeStamp}</span>
				<span className='gm-title'>{title}</span>
			</div>
			<div className='gm-btn'>
				<Link
					to={{
						pathname: targetLink,
					}}
					target='_blank'
					style={{
						margin: '0',
						padding: '0',
						display: 'flex',
						textDecoration: 'none',
					}}>
					<Button
						appearance={
							meetingType === 'google_meet'
								? 'primary'
								: 'secondary'
						}
						text='Join Meet'
					/>
				</Link>
			</div>
		</div>
	);
}
export default MeetingTray;
