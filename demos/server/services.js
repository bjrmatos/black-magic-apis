var spawn = require('child_process').spawn,
	services = [ ],
	current_port = 3000,
	count = 10,
	x_max = 20000,
	range_min = 1000,
	range_max = 1000;


module.exports = services;

function generate() {
	var x,
		range;

	while (count--) {
		x = Math.floor(Math.random() * x_max) * -1;
		range = Math.floor(Math.random() * range_max + range_min);

		services.push({
			id: Math.random().toString(16).slice(3),
			host: 'localhost',
			port: current_port,
			x: x,
			y: 0,
			range: range
		});

		console.log('spawning at ' + current_port);

		spawn('node', ['./carrier/index.js', current_port, x * -1], {
			stdio: 'inherit'
		});

		current_port++;
	}
}

generate();

