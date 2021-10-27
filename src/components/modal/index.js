import './index.css';

import { ImCancelCircle } from 'react-icons/im';
import { Button } from '../button';

function Modal({ setShowModal, modalTitle, modalInputs, modalCallback }) {
	const handleModal = () => {
		const form = document.getElementById('modal-form');
		const formInfo = new FormData(form);
		const payload = {};
		for (var pair of formInfo.entries()) {
			payload[pair[0]] = pair[1];
		}
		return modalCallback(payload);
	};
	return (
		<div className='mp-modal'>
			<div className='modal-container'>
				<span
					className='modal-close'
					onClick={() => setShowModal(false)}>
					<ImCancelCircle />
				</span>
				<h1 className='modal-title'>{modalTitle}</h1>
				<form id='modal-form'>
					{Object.keys(modalInputs).map(
						// {Object.keys(props.modalData['modal-inputs']).map(
						(modalInput, idx) => {
							return (
								<div className='modal-field' key={idx}>
									<div className='modal-label'>
										{modalInput}
									</div>
									<input
										type={modalInputs[modalInput].type}
										className='modal-input'
										name={modalInputs[modalInput].name}
									/>
								</div>
							);
						}
					)}
				</form>
				<Button
					appearance='primary'
					text='Save Changes'
					onClick={handleModal}
				/>
			</div>
		</div>
	);
}

export default Modal;
