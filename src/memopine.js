import './memopine.css';
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Switch, Redirect } from 'react-router-dom';

import PublicRoute from './utils/publicRoute';

import Spotlight from './pages/spotlight';
import Tray from './pages/tray';

function Memopine() {
	// First housekeeping effort
	useEffect(() => {
		localStorage.getItem('dark-theme')
			? document.body.classList.add('dark-theme')
			: document.body.classList.add('light-theme');
	}, []);

	return (
		<div className='memopine'>
			<Router>
				<Switch>
					<PublicRoute exact path='/' component={Spotlight} />
					<PublicRoute exact path='/tray' component={Tray} />
					<Redirect to='/' />
				</Switch>
			</Router>
		</div>
	);
}

export default Memopine;
