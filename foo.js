function plot(xs, ys, div) {
	let trace = {
		x: xs,
		y: ys
	};

	Plotly.newPlot(div, [trace]);
}

function scatter(xs, ys, div) {
	let trace = {
		x: xs,
		y: ys,
		mode: 'markers'
	};

	Plotly.plot(div, [trace]);
}

function chileDate(str, sep) {
	console.log(str);
	const split = str.split(sep);
	const swapped = `${split[1]}/${split[0]}/${split[2]}`;
	return new Date(swapped);
}

function date_in_range(date, startDate, endDate) {
	return startDate.getTime() <= date.getTime() &&
			date.getTime() <= endDate.getTime();
}

// currentPlant.id;
function bar(data, start_d_m_y, end_d_m_y, div) {
	data = _.map(data, d => ({
		date: new Date(d.Year, d.Month, d.Day),
		gen: d.Generacion_MWh
	}));

	const startDate = chileDate(start_d_m_y, '-');
	const endDate = chileDate(end_d_m_y, '-');

	const datesFiltered = _.filter(data, d => 
		date_in_range(d.date, startDate, endDate));

	const sortedByDate = _.sortBy(datesFiltered, d => d.date.getTime());

	const dates = _.pluck(sortedByDate, 'date');
	const gens = _.pluck(sortedByDate, 'gen');

	plot(dates, gens, div);
}

function bar2(data, start_d_m_y, end_d_m_y, div) {
	data = _.map(data, d => ({
		date: new Date(d['año'], d.mes, d['día']),
		baja: d.total_baja
	}));

	const startDate = chileDate(start_d_m_y, '-');
	const endDate = chileDate(end_d_m_y, '-');

	const datesFiltered = _.filter(data, d => 
		date_in_range(d.date, startDate, endDate) && d.baja > 0);

	const sortedByDate = _.sortBy(datesFiltered, d => d.date.getTime());

	console.log(data);

	const dates = _.pluck(sortedByDate, 'date');
	//const gens = new Array(dates.length).fill(0);
	const gens = _.pluck(sortedByDate, 'baja');
	scatter(dates, gens, div);
}

function baz(start_d_m_y, end_d_m_y) {
	const id = currentPlant.id;
	Plotly.d3.csv(`generacion_por_dia\\generacion_pordia_${id}.csv`, function(rows) {
		Plotly.d3.csv(`bajas\\bajas_${id}.csv`, function(bajas) {
			bar(rows, start_d_m_y, end_d_m_y, $('#result')[0]);
			bar2(bajas, start_d_m_y, end_d_m_y, $('#result')[0]);
/*
			$('#result')[0].on('plotly_hover', function(data) {
				const deAbajo = ._filter(data, d => d.curveNumber()
			});*/
		});
	});
}

$(function() {
	currentPlant = {id: 8};
	//baz('01-01-90', '31-12-16');
	baz('01-05-16', '30-05-16');
});