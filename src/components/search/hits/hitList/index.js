import './hitList.css';

import Icon from '../../../iconBoy/iconBoy';

function HitList(props) {
	return (
		<div className='mp-result-hitList'>
			{Object.keys(props.hits).map((hitKey, hitKeyItr) => {
				if (props.hits[hitKey].length === 0) {
					return null;
				}
				return (
					<ul>
						{props.hits[hitKey].map((hit, hitItr) => (
							<li
								className={
									hitKeyItr + hitItr ===
									props.selectedResultIndex
										? 'mp-result-hit mp-result-hit-active'
										: 'mp-result-hit'
								}
								key={`hit-no-${hitKeyItr + hitItr}`}
								onClick={hit.onClick || ''}>
								<Icon serviceName={hit.serviceName} />
								{hit.titleText}
							</li>
						))}
					</ul>
				);
			})}
		</div>
	);
}
export default HitList;
