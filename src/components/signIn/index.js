import './signIn.css';
import { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';

import { GlobalUserContext } from '../../utils/context';

import axios from 'axios';
import {
	handleInternalRedirect,
	setUserSession,
	apiBaseURL,
} from '../../utils/common';
import { Button } from '../button/index';

function SignIn(props) {
	const { userToken } = GlobalUserContext;
	const history = useHistory();
	let redirectReason = null;
	const [isLoading, setIsLoading] = useState(false);
	const [emailID, setEmailID] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState(null);
	// if (
	// 	props.location.state != null &&
	// 	'redirectReason' in props.location.state
	// ) {
	// 	redirectReason = props.location.state.redirectReason;
	// }
	const handleSignUpRedirect = () => {
		props.history.push('/signup');
	};
	const validate = (email, password) => {
		const filter =
			/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
		if (email === '' || password === '') {
			setError('Empty Email or Password');
			return null;
		}
		// if (!filter.test(email.value)) {
		//   setError("Please provide a valid email address");
		//   return null;
		// }

		return {
			email: email,
			username: email,
			password: password,
		};
	};

	const handlelogin = () => {
		setError(null);
		setIsLoading(true);
		const authPayload = validate(emailID, password);
		if (authPayload !== null) {
			axios
				.post(`${apiBaseURL}/v1/tokenReact`, authPayload, {
					headers: {
						accept: 'application/json',
					},
				})
				.then((response) => {
					setUserSession(response.data.access_token);
					handleInternalRedirect(history, '/');
				})
				.catch((error) => {
					setError(error.response.data.message);
				});
		}
		setIsLoading(false);
	};
	return (
		<div className='signIn-container'>
			<div className='signIn-main'>
				<h2 style={{ color: 'red' }}>{error}</h2>
				<h1 className='signIn-main__heading'>Sign In</h1>
				<div className='form-label'>Email Address</div>

				<input
					className='form-input'
					value={emailID}
					onChange={(e) => {
						setEmailID(e.target.value);
					}} // placeholder='Enter your email'
					placeholder=''
				/>
				<div
					className='form-label'
					style={{
						display: 'flex',
						justifyContent: 'space-between',
					}}>
					<span>Password</span>
					<Button appearance='subtle' text='Forgot Password?' />
				</div>
				<input
					type='password'
					className='form-input'
					style={{ marginBottom: '2rem' }}
					value={password}
					onChange={(e) => {
						setPassword(e.target.value);
					}} // placeholder='Enter your password'
					placeholder=''
				/>
				<Button
					appearance='primary'
					text='Sign In'
					onClick={handlelogin}
					isLoading={isLoading}
				/>
			</div>
		</div>
	);
}
export default SignIn;
