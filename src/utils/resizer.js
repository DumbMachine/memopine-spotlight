/* search engine height: 70px */
/* filter height: 50px */
/* search engine + filter : 130px */
/* overall padding: 40px */

const electron = window.require('electron');
const { ipcRenderer } = electron;

function Resizer(props) {
	console.log(props);
	let height = 0;

	//height of padding
	height += 40;

	//height of search engine
	height += 70;

	// filters height
	const filterOpen =
		localStorage.getItem('enable-filters') != null
			? JSON.parse(localStorage.getItem('enable-filters'))
			: true;
	height += filterOpen ? 60 : 0;

	console.log('filter -> ', height);

	// result height
	if (props && props.resultLength) {
		height += 10;
		height += (props.resultLength - 1) * 45;
		height += props.resultLength > 0 ? 50 : 0;
	}

	if (props && props.resultLength) console.log('result Length -> ', height);
	ipcRenderer.send('resize-me-please', {
		width: 840,
		height: Math.min(props && props.setting ? 575 : height, 575),
	});
}
export default Resizer;
