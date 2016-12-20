function test_area_graph(div) {
	const xs = _.range(0, 10, 0.2);

	let traceUp = {
		x: xs,
		y: _.map(xs, x => 0.5*x),
		fill: 'tonexty'
	};

	let traceDown = {
		x: xs, 
		y: _.map(xs, x => 0.8*x)
	}

	Plotly.newPlot(div, [traceDown, traceUp]);
}

function sandwich_graph(xs, ysDown ysUp, div) {
	let traceUp = {
		x: xs,
		y: ysUp,
		fill: 'tonexty'
	};

	let traceDown = {
		x: xs,
		y: ysDown
	};

	Plotly.plot(div, [traceDown, traceUp]);
}

$(function() {
	test_area_graph($('#test-graph')[0]);
});