// from data.js
let tableData = data;

const tbody = d3.select('tbody');
const button = d3.select('#filter-btn');
const clearFilter = d3.select('#clear-filter');
const stateDropdown = d3.select('#state-dropdown');
const shapeDropdown = d3.select('#shape-dropdown');

let states = [];
let shapes = [];

tableData.forEach((row) => {
	if (!states.includes(row.state)) {
		states.push(row.state);
	}
	if (!shapes.includes(row.shape)) {
		shapes.push(row.shape);
	}
});

states.sort();
shapes.sort();

states.forEach((state) => {
	let option = stateDropdown.append('option');
	option.attr('value', state);
	option.text(state.toUpperCase());
});

shapes.forEach((shape) => {
	let option = shapeDropdown.append('option');
	option.attr('value', shape);
	option.text(shape);
});

function showTable(table) {
	tbody.html('');
	table.forEach((datum) => {
		let row = tbody.append('tr');
		Object.entries(datum).forEach(([ key, value ]) => {
			var cell = row.append('td');
			cell.text(value);
		});
	});
}

showTable(tableData);

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

function unfilter() {
	d3.event.preventDefault();
	showTable(tableData);
}

button.on('click', filterAll);
clearFilter.on('click', unfilter);
