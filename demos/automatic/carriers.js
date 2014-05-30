var loop = require('./lib/loop'),
	socket = require('./lib/socket'),
	input = require('./lib/input'),
	menu = require('./lib/menu'),
	position = require('./lib/position'),
	context = require('./lib/context'),
	carriers = [ ],
	image = new Image(),
	loaded = false,
	highlighted = false,
	width,
	height;

function mouseWithinCarrier(carrier) {
	var mouse_x = input.mouse_x - window.innerWidth * 0.5 + position.x,
		half_width = image.width / 2,
		y = Math.floor(window.innerHeight * 0.75) - image.height;

	if (mouse_x > carrier.x - half_width && mouse_x < carrier.x + half_width) {
		if (input.mouse_y > y && input.mouse_y < y + image.height) {
			return true;
		}
	}

	return false;
}

function checkClick(event) {
	var index = carriers.length,
		carrier;

	while (index--) {
		carrier = carriers[index];
		if (mouseWithinCarrier(carrier)) {
			menu.open(carrier);
			break;
		}
	}
}

image.onload = function onload() {
	loaded = true;
};

image.src = 'img/carrier.png';

socket.on('announce', function subscribe(carrier) {
	carriers.push(carrier);
});

socket.on('unannounce', function unsubscribe(carrier) {
	var index = carriers.length;

	while (index--) {
		if (carriers[index].id === carrier.id) {
			carriers.splice(index, 1);
			return;
		}
	}
});

loop.register(function tick(delta) {
	var y,
		half_width,
		hit = false;

	if (!loaded) {
		return;
	}

	y = Math.floor(window.innerHeight * 0.75) - image.height;
	half_width = image.width / 2;

	carriers.forEach(function each(carrier) {
		var x = carrier.x - position.x + window.innerWidth * 0.5;

		context.drawImage(image, x - half_width, y);
		context.fillText(carrier.host + ':' + carrier.port, x, y - 10);

		if (mouseWithinCarrier(carrier)) {
			hit = true;
		}
		
	});

	if (hit) {
		if (!highlighted) {
			highlighted = true;
			context.canvas.style.cursor = 'pointer';
		}
	} else {
		if (highlighted) {
			highlighted = false;
			context.canvas.style.cursor = 'default';
		}
	}

});

document.addEventListener('click', checkClick, false);


