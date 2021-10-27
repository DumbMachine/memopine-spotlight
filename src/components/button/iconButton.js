import './index.css';

function IconButton(props) {
	return (
		<label className='mp-btn mp-btn-icon' onClick={props.onClick}>
			{props.icon}
		</label>
	);
}

export default IconButton;
