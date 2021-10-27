import './index.css';
import { Button, ToggleButton } from '../button/index';

import Integration from '../integration/integration';

function PermissionSection(props) {
	return (
		<div className='section permission-section'>
			<h1 className='section-heading'>Permission</h1>
			<Button
				appearance='primary'
				text='Next'
				onClick={() => props.handleSection(2)}
			/>
			<Integration token={null} integrationSettings={[]} />
		</div>
	);
}

export default PermissionSection;
