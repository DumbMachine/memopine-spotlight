import './index.css';
import { useState } from 'react';

function CheckButton() {
	const [isChecked, setIsChecked] = useState(false);
	const handleChecked = () => {
		setIsChecked(isChecked ^ true);
	};
	return (
		<label className='mp-btn-check' onClick={() => handleChecked}>
			{isChecked ? (
				<input type='checkbox' checked />
			) : (
				<input type='checkbox' />
			)}
			<span className='mp-btn-checkmark'></span>
		</label>
	);
}

export default CheckButton;
