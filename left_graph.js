const sum = list => _.reduce(list, (a, b) => a + b);
const avg = list => sum(list)/list.length;

function chileDate(str) {
	const split = str.split('/');
	const swapped = `${split[1]}/${split[0]}/${split[2]}`;
	return new Date(swapped);
}

function date_in_range(date, startDate, endDate) {
	return startDate.getTime() <= date.getTime() &&
			date.getTime() <= endDate.getTime();
}

// recibe [(radiación, fecha, hora)], (fechaInicio, fechaFin)
// grafica para cada hora el promedio de las radiaciones a esa hora en el rango de fechas
function left_graph(data, startDate, endDate, div) {
	const hours = _.unique(_.pluck(data, 'hour'));

	const datesFiltered = _.filter(data, d =>
		date_in_range(d.date, startDate, endDate));

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

function adapted_tsv(tsv) {
	return _.map(tsv, row => ({
		radiation: row.value,
		date: new Date(2000, row.month, row.day),
		hour: row.hour
	}));
}

$(function() {
	noUiSlider.create($('#range-slider')[0], {
		range: {
			min: new Date('2000').getTime(),
			max: new Date('2001').getTime()
		},

		step: 24*60*60*1000,

		start: [new Date('2000').getTime(), new Date('2001').getTime()]
	});

	$('#range-slider')[0].noUiSlider.on('set', function(values, handle) {
		console.log(_.map(values, timestamp => date_to_string(new Date(+timestamp))));

		const data = adapted_tsv(tsv);
		const startDate = new Date(+values[0]);
		const endDate = new Date(+values[1]);
		left_graph(data, startDate, endDate, $('#left-graph')[0]);
	});
});