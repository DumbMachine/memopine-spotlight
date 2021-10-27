import './search.css';
import React, { useEffect, useState, useRef, useCallback } from 'react';

import Hits from './hits';
import SearchBar from './searchBar';
import {
	escapeToClose,
	triggerZoomSearch,
} from '../setting/integration/ipcListeners';

import { MdSettings } from 'react-icons/md';
import { isMac } from '../../utils/common';
import Resizer from '../../utils/resizer';

class SearchResult {
	constructor(searchResult) {
		this.titleText = searchResult.titleText;
		this.contentText = searchResult.contentText;
		this.targetUrl = searchResult.targetUrl;
		this.mimeType = searchResult.mimeType;
		this.serviceName = searchResult.serviceName;
	}
	static fromZoomSearchResult(searchResult) {
		console.log('this was the search result: ', searchResult);
		return new SearchResult({
			titleText: searchResult.titleText,
			contentText: searchResult.contentText,
			targetUrl: searchResult.targetUrl,
			mimeType: searchResult.mimeType,
			serviceName: searchResult.serviceName,
		});
	}
	static fromGoogleSearchResult(searchResult) {
		throw Error('NotImplmented');
	}
}

// Imply no results found
const noResultsHits = () => {
	return [
		{
			titleText: 'No Results Found',
			contentText: '',
			targetUrl: '',
			mimeType: '',
			serviceName: 'error',
		},
	];
};
// Imply the service is not authenticated
const notAuthenticatedHits = (serviceName) => {
	return [
		{
			titleText: `${serviceName} is not authenticated`,
			contentText: '',
			// No redirect
			targetUrl: '',
			mimeType: '',
			serviceName: serviceName,
			// serviceName: "error",
		},
	];
};

function Search({ setSettingOpen }) {
	const [searchText, setSearchText] = useState('');
	const [hits, setHits] = useState({});
	const [flatHits, setFlatHits] = useState([]);
	const [hitsLen, setHitsLen] = useState(0);
	const [isOpen, setIsOpen] = useState(false);
	const [loadingResults, setLoadingResults] = useState(false);
	const [displayError, setDisplayError] = useState('No Recent Search');
	const [selectedResultIndex, setSelectedResultIndex] = useState(0);
	const [selectedFilterIndex, setSelectedFilterIndex] = useState(0);
	const [searchAService, setSearchAService] = useState(null);
	const [showFilters, setShowFilters] = useState(
		JSON.parse(localStorage.getItem('enable-filters')) != null
			? JSON.parse(localStorage.getItem('enable-filters'))
			: true
	);

	const runningServices = ['meeting', 'email', 'figma'];

	const searchBarOptions = ['all', ...runningServices];

	const clearSearch = (close = false) => {
		setSearchText('');
		setHits({});
		setFlatHits([]);
		setHitsLen(0);
		setSelectedResultIndex(0);
		setIsOpen(close);
	};

	const handleRedirect = (targetUrl) => {
		window.open(targetUrl, '_blank');
		window.focus();
	};

	function useEventListener(eventName, handler, element = window) {
		const savedHandler = useRef();

		useEffect(() => {
			savedHandler.current = handler;
		}, [handler]);

		useEffect(() => {
			const isSupported = element && element.addEventListener;
			if (!isSupported) return;

			const eventListener = (event) => savedHandler.current(event);
			element.addEventListener(eventName, eventListener);

			return () => {
				element.removeEventListener(eventName, eventListener);
			};
		}, [eventName, element]);
	}
	const handleKeyDown = useCallback(
		(event) => {
			const isActionKey = isMac ? event.metaKey : event.ctrlKey;

			if (event.key === 'Tab') {
				event.preventDefault();
				setSelectedFilterIndex(
					(selectedFilterIndex) =>
						(selectedFilterIndex + 1) % searchBarOptions.length
				);
				clearSearch();
			}
			if (isOpen) {
				// TODO: Convert this into a Case
				if (isActionKey && event.key === 'Enter') {
					// TODO: Custom event, don't open new tab but open mini preview? :thinking_face ?
					if (typeof flatHits[selectedResultIndex] !== 'undefined') {
						if (selectedFilterIndex != 0)
							handleRedirect(
								flatHits[selectedResultIndex].targetUrl
							);
					}
				} else if (event.key === 'Enter') {
					if (typeof flatHits[selectedResultIndex] !== 'undefined') {
						if (selectedFilterIndex != -1)
							handleRedirect(
								flatHits[selectedResultIndex].targetUrl
							);
					}
				} else if (event.key === 'ArrowUp') {
					event.preventDefault();
					setSelectedResultIndex(
						(selectedResultIndex) =>
							(hitsLen + selectedResultIndex - 1) % hitsLen
					);
				} else if (event.key === 'ArrowDown') {
					event.preventDefault();
					setSelectedResultIndex(
						(selectedResultIndex) =>
							(selectedResultIndex + 1) % hitsLen
					);
				} else if (event.key === 'Escape') {
					// TODO: This should be placed in spotlight.js, precedence
					escapeToClose().then((resp) => {
						console.log('espace gave this: ', resp);
					});
					clearSearch();
				}
			}
		},
		[selectedResultIndex, hits]
	);

	useEventListener('keydown', handleKeyDown);

	const showRecommendations = (searchText) => {
		const recommendations = runningServices.map((service, idx) => {
			return {
				titleText: `Search ${searchText} in ${service}`,
				serviceName: service,
				onClick: () => setSelectedFilterIndex(idx + 1),
			};
		});
		[
			'No Results Found in history',
			// 'You have been referred to Microsoft',
			// 'AirFrance Ticket cancellation',
		].map((item) => {
			recommendations.unshift({
				titleText: item,
				serviceName: 'history',
			});
		});

		setDisplayError('');
		setHitsLen(recommendations.length);
		Resizer({ resultLength: recommendations.length });
		setFlatHits(recommendations);
		setHits(groupBy(recommendations, 'mimeType'));
		setLoadingResults(false);
	};

	useEffect(() => {
		setShowFilters(
			localStorage.getItem('enable-filters') != null
				? JSON.parse(localStorage.getItem('enable-filters'))
				: true
		);
		setTimeout(() => {
			if (searchText !== '') {
				setIsOpen(true);
				triggerZoomSearch(searchText)
					.then((response) => {
						const data = response.data;
						setHitsLen(data.length);
						setFlatHits(data);
						setHits(groupBy(data, 'mimeType'));
						setTimeout(() => {
							setLoadingResults(false);
						}, 500);
					})
					.catch((error) => {
						setDisplayError(
							error.message ||
								error.response.data.message ||
								'UwU something go wrong'
						);
						Resizer();
						setTimeout(() => {
							setLoadingResults(false);
						}, 500);
					});
			}
		}, 500);
	}, [searchText, selectedFilterIndex]);

	function groupBy(arr, criteria) {
		return arr.reduce(function (obj, item) {
			let key =
				typeof criteria === 'function'
					? criteria(item)
					: item[criteria];
			if (!Object.prototype.hasOwnProperty.call(obj, key)) {
				obj[key] = [];
			}
			obj[key].push(item);

			return obj;
		}, {});
	}

	return (
		<div className='mp-spotlight-container'>
			<SearchBar
				clearSearch={clearSearch}
				setSearchText={setSearchText}
				loadingResults={loadingResults}
				selectedFilterIndex={selectedFilterIndex}
				setSelectedFilterIndex={setSelectedFilterIndex}
				handleKeyDown={handleKeyDown}
				runningServices={runningServices}
			/>
			{(showFilters || isOpen) && (
				<div className='mp-search-results'>
					{isOpen && (
						<div className='mp-search-result-wrapper'>
							{/* {displayError && (
						<div className='mp-search-result-error'>
							{displayError}
						</div>
					)} */}
							{!loadingResults && (
								<Hits
									hits={hits}
									selectedResultIndex={selectedResultIndex}
								/>
							)}
						</div>
					)}
					{showFilters && (
						<div className='mp-search-filters'>
							<div className='mp-search-filters-wrapper'>
								{searchBarOptions.map(
									(optionComponent, optionItr) => {
										return (
											<div
												key={optionItr}
												className={
													optionItr ===
													selectedFilterIndex
														? 'mp-search-filter mp-search-filter-selected'
														: 'mp-search-filter'
												}
												onClick={() => {
													setSelectedFilterIndex(
														optionItr
													);
												}}>
												{optionComponent}
											</div>
										);
									}
								)}
							</div>
							<div
								className='mp-search-setting'
								onClick={() => setSettingOpen(true)}>
								<MdSettings />
							</div>
						</div>
					)}
				</div>
			)}
		</div>
	);
}

export default Search;
