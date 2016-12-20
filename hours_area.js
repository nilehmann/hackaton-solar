function integral(xs, ys) {
	let sum = 0;
	for (let i = 0; i < xs.length-1; ++i)
		sum += (xs[i+1] - xs[i])*(ys[i] + ys[i+1])*.5;
	return sum;
}

function sandwich_area(xs, ysDown, ysUp) {
	return integral(xs, ysUp) - integral(xs, ysDown);
}

function hours_area(ysDown, ysUp) {
	const xs = _.range(1, 25);

	return sandwich_area(xs, ysDown, ysUp);
}