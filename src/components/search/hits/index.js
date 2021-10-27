import './hits.css';

import HitList from './hitList';

function Hits({ hits, selectedResultIndex }) {
	if (Object.keys(hits).length > 0)
		return (
			<div className='mp-result-hits'>
				<HitList
					hits={hits}
					selectedResultIndex={selectedResultIndex}
				/>
			</div>
		);
	else return null;
}
export default Hits;
