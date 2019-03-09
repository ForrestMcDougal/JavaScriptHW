// from data.js
let tableData = data;

/**
 * Function to proper (title) case a string
 */
String.prototype.toProperCase = function() {
	return this.replace(/\w\S*/g, function(txt) {
		return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
	});
};

const tbody = d3.select('tbody');
const button = d3.select('#filter-btn');
const clearFilter = d3.select('#clear-filter');
const stateDropdown = d3.select('#state-dropdown');
const shapeDropdown = d3.select('#shape-dropdown');

let states = [];
let shapes = [];

/**
 * Go through all of the data and append state and shape
 * to array if not present. This is used in the dropdowns.
 * ALso clean up HTML codes that come with data.
 */
tableData.forEach((row) => {
	row.state = row.state.toUpperCase();
	row.city = row.city.toProperCase();

	// add state and shape to respective array
	if (!states.includes(row.state)) {
		states.push(row.state);
	}
	if (!shapes.includes(row.shape)) {
		shapes.push(row.shape);
	}

	// clean up html codes
	row.comments = row.comments.replace(/&#44/g, ',');
	row.comments = row.comments.replace(/&#39/g, "'");
	row.comments = row.comments.replace(/&#33/g, '!');

	// delete the country attribute due to redundancy
	delete row.country;
});

states.sort();
shapes.sort();

/**
 * Add options to the dropdowns for each state and shape
 */
states.forEach((state) => {
	let option = stateDropdown.append('option');
	option.attr('value', state);
	option.text(state);
});

shapes.forEach((shape) => {
	let option = shapeDropdown.append('option');
	option.attr('value', shape);
	option.text(shape);
});

/**
 * showTable is used to paint the table onto the DOM
 * Take in a dataset and append rows for each data point
 * @param {object} table 
 */
function showTable(table) {
	// clear all of the table html
	tbody.html('');

	// add in row for each entry
	table.forEach((datum) => {
		let row = tbody.append('tr');
		Object.entries(datum).forEach(([ k, value ]) => {
			var cell = row.append('td');
			cell.text(value);
		});
	});
}

showTable(tableData);

/**
 * go through all of the filters progressively to 
 * get only targeted data.
 */
function filterAll() {
	// filter by date
	d3.event.preventDefault();
	const dateInput = d3.select('#datetime');
	const date = dateInput.property('value');
	let table = tableData;
	if (date !== '') {
		table = table.filter((row) => row.datetime === date);
	}

	// filter by state
	const state = stateDropdown.node().value;
	if (state !== '') {
		table = table.filter((row) => row.state === state);
	}

	// filter by shape
	const shape = shapeDropdown.node().value;
	if (shape !== '') {
		table = table.filter((row) => row.shape === shape);
	}

	// show filtered table
	showTable(table);
}

/**
 * remove all filters and show original table
 */
function unfilter() {
	d3.event.preventDefault();

	// remove all filters
	document.getElementById('datetime').value = '';
	document.getElementById('state-dropdown').selectedIndex = 0;
	document.getElementById('shape-dropdown').selectedIndex = 0;

	// show original table
	showTable(tableData);
}

// event handlers
button.on('click', filterAll);
clearFilter.on('click', unfilter);
