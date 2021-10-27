import './index.css';
import { useEffect, useState } from 'react';

import WelcomeSection from './welcome';
import PermissionSection from './permission';
import SettingSection from './setting';

function OnBoarding() {
	const [onBoardingSection, setOnBoardingSection] = useState(0);

	const handleSection = (section) => {
		console.log(section);
		setOnBoardingSection(section);
	};

	useEffect(() => {}, []);

	return (
		<div className='onboarding'>
			{onBoardingSection === 0 && (
				<WelcomeSection handleSection={handleSection} />
			)}
			{onBoardingSection === 1 && (
				<PermissionSection handleSection={handleSection} />
			)}
			{onBoardingSection === 2 && <SettingSection />}
		</div>
	);
}

export default OnBoarding;
