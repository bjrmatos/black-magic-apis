var states = {
	left: false,
	right: false,
	down: false,
	up: false,
	mouse_x: 0,
	mouse_y: 0
};

var known_keys = [
	37,
	38,
	39,
	40
];

function keydown(event) {
	var key = event.keyCode || event.charCode;

	if (known_keys.indexOf(key) === -1) {
		return;
	}

	if (key === 37) {
		states.left = true;
	} else if (key === 38) {
		states.up = true;
	} else if (key === 39) {
		states.right = true;
	} else if (key === 40) {
		states.down = true;
	}

	event.preventDefault();
	return false;
}

function keyup(event) {
	var key = event.keyCode || event.charCode;

	if (known_keys.indexOf(key) === -1) {
		return;
	}

	if (key === 37) {
		states.left = false;
	} else if (key === 38) {
		states.up = false;
	} else if (key === 39) {
		states.right = false;
	} else if (key === 40) {
		states.down = false;
	}

	event.preventDefault();
	return false;
}

function mousemove(event) {
	states.mouse_x = event.pageX;
	states.mouse_y = event.pageY;
}

document.addEventListener('keydown', keydown, false);
document.addEventListener('keyup', keyup, false);

document.addEventListener('mousemove', mousemove, false);


module.exports = states;
