import './index.css';

function ToggleButton(props) {
	return (
		<label className='mp-btn-toggle'>
			{props.isChecked ? (
				<input
					type='checkbox'
					checked
					onClick={() => props.onClick()}
				/>
			) : (
				<input type='checkbox' onClick={() => props.onClick()} />
			)}
			<span className='mp-btn-slider mp-btn-round'></span>
		</label>
	);
}

export default ToggleButton;
