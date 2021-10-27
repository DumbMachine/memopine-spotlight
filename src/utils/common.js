/*
TODO: Use Manual expiration for sessionStorage
var expires = new Date(year, month, day, hours, minutes, seconds, milliseconds);
var sessionObject = {
    expiresAt: expires,
    someOtherSessionData: {
        username: ''
    }
}
sessionStorage.setItem('sessionObject', JSON.stringify(sessionObject));

*/

// import shell from "shell";
// const { shell } = window.require("electron"); // Import at top of page..
// import electron from "electron";
import axios from 'axios';
import { useState, useEffect } from 'react';

export const isMac = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'].reduce(
	(accumulator, currentValue) => {
		return (
			window.navigator.platform.indexOf(currentValue) !== -1 ||
			accumulator
		);
	},
	false
);

export const apiBaseURL =
	process.env.NODE_ENV === 'development'
		? 'http://127.0.0.1:8000'
		: 'https://memopine.herokuapp.com';

// return the user data from the session storage
export const getUser = () => {
	const tokenStr = sessionStorage.getItem('token');
	if (tokenStr) return tokenStr;
	else return null;
};

// return the token from the session storage
export const getToken = () => {
	const token = sessionStorage.getItem('token') || null;
	return token;
};

// remove the token and user from the session storage
export const removeUserSession = () => {
	sessionStorage.removeItem('token');
	sessionStorage.removeItem('refreshToken');
};

// set the token and user from the session storage
export const setUserSession = (token, refreshToken = null) => {
	sessionStorage.setItem('token', token);
	sessionStorage.setItem('refreshToken', refreshToken);
};

export const setSettings = (userSettings) => {
	sessionStorage.setItem('userSettings', userSettings);
};
export const getSettings = (userSettings) => {
	const DEFAULT_SETTINGS = {
		general: {
			enableDarkMode: { value: true, optionText: 'enableDarkMode' },
			showOnStartup: { value: true, optionText: 'showOnStartup' },
			enableLocalFileSearch: {
				value: true,
				optionText: 'Enable Local File searching',
			},
		},
		integrations: [],
	};
	const localStorage =
		sessionStorage.getItem('userSettings', userSettings) ||
		DEFAULT_SETTINGS;
	return localStorage;
};
export const removeSettings = () => {
	sessionStorage.removeItem('userSettings');
};

export const handleInternalRedirect = (history, target) => {
	const allRedirects = {
		about: '/about',
		signin: '/signin',
		signup: '/signup',
		contact: '/contact',
		search: '/',
		onboarding: '/home',
	};
	history.push(allRedirects[target]);
};

export const authenticatedAxios = (token = null) => {
	const tokenFromStorage = getToken();
	const accessToken = token || tokenFromStorage;
	// TODO: Validate token before returning a instance :self
	const defaultOptions = {
		// baseURL: process.env.REACT_APP_API_PATH,
		headers: {
			Accept: 'application/json',
		},
	};

	let instance = axios.create(defaultOptions);

	instance.interceptors.request.use(function (config) {
		config.headers.Authorization = token ? `Bearer ${accessToken}` : '';
		return config;
	});

	return instance;
};

const hasFocus = () => typeof document !== 'undefined' && document.hasFocus();

const useWindowFocus = () => {
	const [focused, setFocused] = useState(hasFocus); // Focus for first render

	useEffect(() => {
		setFocused(hasFocus()); // Focus for additional renders

		const onFocus = () => setFocused(true);
		const onBlur = () => setFocused(false);

		window.addEventListener('focus', onFocus);
		window.addEventListener('blur', onBlur);

		return () => {
			window.removeEventListener('focus', onFocus);
			window.removeEventListener('blur', onBlur);
		};
	}, []);

	return focused;
};

export default useWindowFocus;
