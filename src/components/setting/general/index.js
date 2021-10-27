import './general.css';
import { useState } from 'react';

import { CgOptions } from 'react-icons/cg';
import { ToggleButton } from '../../button';

function General() {
	const [generalSettings, setGeneralSettings] = useState({
		enableDarkMode: {
			value:
				JSON.parse(localStorage.getItem('dark-theme')) != null
					? JSON.parse(localStorage.getItem('dark-theme'))
					: false,
			optionText: 'Dark Mode',
		},
		enableLocalFileSearch: {
			value: false,
			optionText: 'Local File searching',
		},
		enableFilters: {
			value:
				JSON.parse(localStorage.getItem('enable-filters')) != null
					? JSON.parse(localStorage.getItem('enable-filters'))
					: false,
			optionText: 'Show Filters',
		},
	});
	const handleSelect = (keyName) => {
		let local = { ...generalSettings };
		if (keyName === 'enableDarkMode') {
			document.body.classList.contains('light-theme')
				? enableDarkMode()
				: enableLightMode();
		}
		if (keyName === 'enableFilters') {
			local[keyName].value
				? localStorage.setItem('enable-filters', false)
				: localStorage.setItem('enable-filters', true);
		}
		local[keyName].value = !local[keyName].value;
		setGeneralSettings(local);
	};
	const enableDarkMode = () => {
		document.body.classList.remove('light-theme');
		document.body.classList.add('dark-theme');
		localStorage.setItem('dark-theme', true);
	};
	const enableLightMode = () => {
		document.body.classList.remove('dark-theme');
		document.body.classList.add('light-theme');
		localStorage.setItem('dark-theme', false);
	};

	return (
		<div className='mp-setting-section'>
			<span className='mp-setting-section-title'>
				<CgOptions />
				<span>General</span>
			</span>
			<div className='mp-setting-section-options'>
				{Object.keys(generalSettings).map((optionName, optionItr) => {
					return (
						<div
							key={optionItr}
							className={
								generalSettings[optionName].value === true
									? 'mp-setting-option mp-option-active mp-option-selected'
									: 'mp-setting-option mp-option-active'
							}>
							<span>
								{generalSettings[optionName].optionText}
							</span>
							<ToggleButton
								isChecked={generalSettings[optionName].value}
								onClick={() => handleSelect(optionName)}
							/>
						</div>
					);
				})}
			</div>
		</div>
	);
}
export default General;
