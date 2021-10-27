import './toggle.css';

function Toggle() {
	return (
		<label className='switch'>
			<input type='checkbox' checked/>
			<span className='slider round'></span>
		</label>
	);
}

export default Toggle;
