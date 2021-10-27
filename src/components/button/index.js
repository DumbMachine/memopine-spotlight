import './index.css';
import ToggleButton from './toggleButton';
import CheckButton from './checkButton';
import IconButton from './iconButton';

function Button(props) {
	return (
		<button
			className={`mp-btn mp-btn-${props.appearance}`}
			onClick={props.onClick}>
			{props.isLoading ? <div className='loader'></div> : props.text}
		</button>
	);
}
export { Button, ToggleButton, CheckButton, IconButton };
