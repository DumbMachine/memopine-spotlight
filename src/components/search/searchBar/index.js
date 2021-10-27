import './searchBar.css';

import Loader from '../../loader';
import { BsSearch } from 'react-icons/bs';

function SearchBar(props) {
	const searchPlaceHolder = [
		'Search across your services ...',
		...props.runningServices.map((service) => {
			return `Search in ${service} ...`;
		}),
	];

	const inputElement = document.getElementsByClassName('mp-search-input')[0];

	const clearSearchInput = () => {
		inputElement.value = '';
	};

	const performSearch = (event) => {
		event.persist();
		setTimeout(() => {
			const searchText = event.target.value.trim();
			if (props.selectedFilterIndex === 0) {
				const filterSearched = props.runningServices.map((service) => {
					return new RegExp('\\b' + service + '\\b', 'i').test(
						searchText
					);
				});
				if (filterSearched.includes(true)) return;
				else props.setSearchText(searchText);
			} else props.setSearchText(searchText);
		}, 500);
	};

	const performFilterSearch = (event) => {
		event.persist();
		if (event.key === 'Enter' && props.selectedFilterIndex === 0) {
			const searchText = inputElement.value.trim();
			props.runningServices.forEach((service, idx) => {
				if (new RegExp('\\b' + service + '\\b', 'i').test(searchText)) {
					props.setSelectedFilterIndex(idx + 1);
					props.clearSearch();
					clearSearchInput();
				}
			});
		}
	};

	return (
		<div className='mp-search-bar'>
			<input
				className='mp-search-input'
				onMouseDown={(event) => event.preventDefault()}
				placeholder={searchPlaceHolder[props.selectedFilterIndex]}
				onChange={performSearch}
				onKeyDown={performFilterSearch}
				autoFocus
				onBlur={({ target }) => target.focus()}
			/>
			<div className='mp-search-btn'>
				{props.loadingResults ? <Loader /> : <BsSearch />}
			</div>
		</div>
	);
}
export default SearchBar;
