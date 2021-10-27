import './setting.css';
import { useState } from 'react';

import Modal from '../modal';
import General from './general';
import Integration from './integration';

import { BiArrowBack } from 'react-icons/bi';
import { getSettings } from '../../utils/common';

const FigmaFormData = {
	modalTitle: 'Figma Settings',
	modalInputs: {
		'App Id': {
			type: 'text',
			name: ' app_id',
		},
	},
	'modal-callback': (formOutput) => {
		console.log('Form paylod: ', formOutput);
	},
};

function Setting({ setSettingOpen, token }) {
	const [integrationSettings, setIntegrationSettings] = useState([]);
	const [showModal, setShowModal] = useState(false);

	return (
		<div className='mp-setting'>
			<div className='mp-setting-container'>
				<div
					className='mp-back-btn'
					onClick={() => setSettingOpen(false)}>
					<BiArrowBack />
				</div>
				<span className='mp-setting-title'>Setting</span>
				<General />
				<Integration
					token={token}
					integrationSettings={integrationSettings}
				/>
				{showModal && (
					<Modal
						setShowModal={setShowModal}
						modalData={FigmaFormData}
						modalTitle={'Figma Settings'}
						modalInputs={{
							'App Id': {
								type: 'text',
								name: ' app_id',
							},
						}}
						modalCallback={(formOutput) => {
							console.log('Form paylod: ', formOutput);
						}}
					/>
				)}
			</div>
		</div>
	);
}
export default Setting;
