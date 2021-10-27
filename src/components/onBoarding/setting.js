import './index.css';
import { Button, CheckButton } from '../button';

function SettingSection() {
	return (
		<div className='section setting-section'>
			<h1 className='section-heading'>last page</h1>
			<div className='setting-option'>
				<div className='option-section'>
					<h1 className='permission-option-heading'>
						Window Management
					</h1>
				</div>
				<div className='option-toggle'>
					<CheckButton />
				</div>
			</div>
			<Button appearance='primary' text='Finish' />
		</div>
	);
}

export default SettingSection;
