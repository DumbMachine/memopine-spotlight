import './index.css';

import { BiSearchAlt } from 'react-icons/bi';
import { Button } from '../button/index';

function WelcomeSection(props) {
	return (
		<div className='section welcome-section'>
			<div className='welcome-img'>
				<div className='search-bar-img img-right'>
					<BiSearchAlt />
					<span style={{fontSize:'4rem'}}>Wel...</span>
				</div>
				<div className='search-bar-img img-left'>
					<span style={{fontSize:'4rem'}}>...Memopine</span>
				</div>
			</div>
			<h1>Welcome to Memopine</h1>
			<Button
				appearance='primary'
				text='Next'
				onClick={() => props.handleSection(1)}></Button>
		</div>
	);
}

export default WelcomeSection;
