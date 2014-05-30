var loop = require('./loop'),
	input = require('./input'),
	socket = require('./socket'),
	position = {
		x: 0,
		y: Math.floor(window.innerHeight * 0.25)
	},
	speed = 5,
	coordinate_element = document.getElementById('coordinates');

module.exports = position;

loop.register(function tick(delta) {
	var prior_x = position.x,
		prior_y = position.y;

	if (input.left) {
		position.x -= speed;
	}

	if (input.right) {
		position.x += speed;
	}

	if (input.up) {
		position.y -= speed;
	}

	if (input.down) {
		position.y += speed;
		if (position.y > window.innerHeight * 0.75 - 108) {
			position.y = window.innerHeight * 0.75 - 108;
		}
	}

	if (position.x !== prior_x || position.y !== prior_y) {
		coordinate_element.innerHTML = Math.floor(position.x) + ', ' + Math.floor(position.y);
		socket.send(position);
	}

});

socket.on('connect', function handler() {
	socket.send(position);
});
