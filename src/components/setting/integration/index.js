import './integration.css';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

import {
	checkRedirectOver,
	getIntegrationSettings,
	updateIntegrationSettings,
	triggerServiceSync,
} from './ipcListeners';

import Loader from '../../loader';
import Icon from '../../iconBoy/iconBoy';
import { IconButton } from '../../button';
import { DiGitMerge } from 'react-icons/di';
import { FiChevronDown } from 'react-icons/fi';

const AUTH_TIMEOUT_LIMIT = 12000;
const AUTH_TRUE = 'AUTH_TRUE';
const AUTH_LOADING = 'AUTH_LOADING';
const AUTH_FAILED = 'AUTH_FAILED';
const AUTH_FALSE = 'AUTH_FALSE';
const AUTH_NOT_STARTED = 'AUTH_NOT_STARTED';
const NO_SYNC_SINCE_NO_AUTH = 'Cannot sync without auth';

const SYNC_NOT_STARTED = 'Sync Now';
const SYNCING = 'Syncing ...';
// this should be ephemeral and not last long
const SYNC_FAILED = 'Failed to Sync ...';
const SYNCED = 'Synced just now';

// Loader seen when waiting for callback from integration
function IntegrationWaiter() {
	return <Loader />;
}

/**
 * Create a promise that rejects in <ms> milliseconds
 * @param {int} ms
 * @param {Promise} promise
 * @returns
 */
const returnPromiseInTimeOrFail = function (promise, ms = AUTH_TIMEOUT_LIMIT) {
	let timeout = new Promise((_, reject) => {
		let id = setTimeout(() => {
			clearTimeout(id);
			reject('RequestTimeout');
		}, ms);
	});

	return Promise.race([promise, timeout]);
};

function IntegrationCard({
	token,
	serviceNameItr,
	serviceObject,
	allServices,
	setAllServices,
}) {
	const {
		serviceName,
		helperText,
		authenticated,
		authenticateUrl,
		deAuthenticateUrl,
	} = serviceObject;
	const [authStatus, setAuthStatus] = useState(
		authenticated ? AUTH_TRUE : AUTH_NOT_STARTED
	);
	const [syncStatus, setSyncStatus] = useState(SYNC_NOT_STARTED);

	const handleSyncAction = () => {
		setSyncStatus(SYNCING);
		if (authStatus !== AUTH_TRUE) {
			setSyncStatus(NO_SYNC_SINCE_NO_AUTH);
		} else {
			returnPromiseInTimeOrFail(triggerServiceSync(serviceName))
				.then((response) => {
					setSyncStatus(SYNCED);
					console.log('We got this payload: ', response);
				})
				.catch((response) => {
					setSyncStatus(SYNC_FAILED);
					console.log('Failed We got this payload: ', response);
				});
		}
	};

	const handleAuthAction = () => {
		setAuthStatus(AUTH_LOADING);
		returnPromiseInTimeOrFail(checkRedirectOver(setAuthStatus))
			.then((response) => {
				const tempallServices = [...allServices];
				serviceObject.authenticated = true;
				tempallServices[serviceNameItr] = serviceObject;
				updateIntegrationSettings(serviceObject).then((response) => {
					console.log('Updaet gave us this: ', response);
				});
				setAuthStatus(AUTH_TRUE);
				setAllServices(tempallServices);
			})
			.catch((err) => {
				console.log('we failed the fetch', err);
				// prolly timedout in time
				setAuthStatus(AUTH_FAILED);
			});
	};

	return (
		<>
			{authStatus === AUTH_LOADING ? (
				<IntegrationWaiter authStatus={authStatus} />
			) : (
				<div className='mp-setting-option option-active mp-option-selected option-separate'>
					<Icon serviceName={serviceName} />
					<div
						style={{
							display: 'flex',
							flexGrow: '1',
							fontSize: '1.2rem',
						}}>
						{serviceName}
					</div>
					<button
						className='button button-yellow'
						onClick={handleSyncAction}>
						{syncStatus}
					</button>
					<Link
						to={{
							pathname: !authenticated
								? authenticateUrl + '/' + 'bean-stalk-django'
								: deAuthenticateUrl + '/' + 'bean-stalk-django',
						}}
						target='_blank'
						style={{
							margin: '0',
							padding: '0',
							display: 'flex',
							textDecoration: 'none',
						}}>
						<button
							className={
								authenticated
									? 'button button-red'
									: 'button button-green'
							}
							onClick={handleAuthAction}>
							{authenticated ? 'Disconnect' : 'Connect'}
						</button>
					</Link>
					<div className='dropdown'>
						<IconButton icon={<FiChevronDown />} />
						<div className='dropdown-content'>
							<a href='#'>Sync</a>
						</div>
					</div>
				</div>
			)}
		</>
	);
}

function Integration({
	token,
	// newServices,
	// allServices,
	// setNewServices,
	// setAllServices,
}) {
	const [error, setError] = useState(null);
	const [allServices, setAllServices] = useState([]);

	useEffect(async () => {
		const oldIntegrations = {};
		if (Object.keys(oldIntegrations).length === 0) {
			getIntegrationSettings()
				.then((response) => {
					setAllServices(response.data);
				})
				.catch((error) => {
					console.error(error.status);
				});
		} else {
			setAllServices(oldIntegrations);
		}
	}, []);

	return (
		<div className='mp-setting-section integration-section'>
			<h2 style={{ color: 'red' }}>{error}</h2>
			<span className='mp-setting-section-title'>
				<DiGitMerge />
				<span>Integration</span>
			</span>
			<div className='mp-setting-section-options'>
				{allServices &&
					allServices.map((serviceObject, serviceNameItr) => {
						return (
							<IntegrationCard
								key={serviceNameItr}
								serviceObject={serviceObject}
								serviceNameItr={serviceNameItr}
								allServices={allServices}
								setAllServices={setAllServices}
							/>
						);
					})}
			</div>
		</div>
	);
}
export default Integration;
