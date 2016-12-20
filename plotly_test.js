const sum = list => _.reduce(list, (a, b) => a + b);
const avg = list => sum(list)/list.length;

function test() {
	let trace = {
		x: [1, 2, 3, 4, 5],
		y: [1, 2, 4, 8, 16]
	};

	let layout = {
		margin: {t: 0}
	};

	Plotly.plot(document.getElementById('result'), [trace], layout);
}

function test2() {
	Plotly.d3.csv("GENER-BRUTA-DIARI-SING.csv", (err, rows) => {
		let trace = {
			type: 'scatter',
			//mode: 'lines',
			x: _.pluck(rows, 'FECHA'),
			y: _.pluck(rows, 'MWh')
		};

		let layout = {
			yaxis: {title: "MWh"},
			xaxis: {
				showgrid: false,
				tickformat: "%B, %Y"
			}
		};

		Plotly.plot(document.getElementById('result'), [trace], layout);
	});
}

function test3() {
	let trace = {
		mode: 'markers+text',
		x: [3, 2, 4],
		y: [1, 2, 3]
	};

	let layout = {
		margin: {t: 0}
	};

	Plotly.plot($('#result')[0], [trace], layout);
}

function test4() {
	const tau = Math.PI*2;
	const xs = _.range(0, tau, 0.2);

	let traceUp = {
		x: xs,
		y: _.map(xs, x => Math.sin(x) + 7),
		mode: 'markers+text'
	};

	let traceDown = {
		x: xs,
		y: _.map(xs, x => Math.sin(x)*.5 + 5),
		mode: 'markers+text'
	};

	let layout = {
		margin: {t: 0}
	};

	Plotly.plot($('#result')[0], [traceUp, traceDown], layout);
}

function test5() {
	const random_point = () => ({x: Math.random()*10, y: Math.random()*5});

	let points = _.map(Array(100), random_point);

	let trace = {
		x: _.pluck(points, 'x'),
		y: _.pluck(points, 'y'),
		mode: 'markers'
	};

	let layout = {
		margin: {t: 0}
	};

	Plotly.plot($('#result')[0], [trace], layout);
}

// recibe [(radiación, fecha, hora)], (fechaInicio, fechaFin)
// grafica para cada hora el promedio de las radiaciones a esa hora en el rango de fechas

function chileDate(str) {
	const split = str.split('/');
	const swapped = `${split[1]}/${split[0]}/${split[2]}`;
	return new Date(swapped);
}

function date_in_range(date, startDate, endDate) {
	return startDate.getTime() <= date.getTime() &&
			date.getTime() <= endDate.getTime();
}

function left_graph(data, startDate, endDate, div) {
	const hours = _.unique(_.pluck(data, 'hour'));

	const datesFiltered = _.filter(data, d =>
		date_in_range(chileDate(d.date), startDate, endDate));

	const radiations = hour => {
		const hourFiltered = _.filter(datesFiltered, d => d.hour == hour);
		return _.pluck(hourFiltered, 'radiation');
	};

	let trace = {
		x: hours,
		y: _.map(hours, hour => avg(radiations(hour)))
	};

	let layout = {
		margin: {t: 0}
	};

	Plotly.newPlot(div, [trace], layout);
}

function date_to_string(date) {
	return `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`;
}

$(function() {
	noUiSlider.create($('#range-slider')[0], {
		range: {
			min: new Date('1990').getTime(),
			max: new Date('2017').getTime()
		},

		step: 24*60*60*1000,

		start: [new Date('2011').getTime(), new Date('2015').getTime()]
	});

	$('#range-slider')[0].noUiSlider.on('set', function(values, handle) {
		console.log(_.map(values, timestamp => date_to_string(new Date(+timestamp))));

		const startDate = new Date(+values[0]);
		const endDate = new Date(+values[1]);
		//$('#left-graph').empty();
		left_graph(data, startDate, endDate, $('#left-graph')[0]);
	});
});
/*
$(function() {
	$('#range-slider').dateRangeSlider({
		range: {min: new Date('1990')},
		bounds: {
			min: new Date('1990'),
			max: new Date('2017')
		},
		defaultValues: {
			min: new Date('1990'),
			max: new Date('2016')
		}
	});
});*/