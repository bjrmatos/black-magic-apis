;(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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



},{"./lib/context":4,"./lib/input":6,"./lib/loop":7,"./lib/menu":8,"./lib/position":9,"./lib/socket":10}],2:[function(require,module,exports){
var loop = require('./lib/loop'),
	position = require('./lib/position'),
	input = require('./lib/input'),
	context = require('./lib/context'),
	image = new Image(),
	loaded = false,
	x,
	sprite,
	reflected = false;


image.onload = function onload() {
	var canvas = document.createElement('canvas');

	sprite = canvas.getContext('2d');

	loaded = true;
	x = Math.floor((window.innerWidth / 2) - (image.width / 2));

	canvas.width = image.width;
	canvas.height = image.height;

	sprite.scale(-1, 1);
	sprite.translate(-image.width, 0);
	sprite.drawImage(image, 0, 0);
};

image.src = 'img/helicopter.png';

loop.register(function tick(delta) {
	if (!loaded) {
		return;
	}

	if (input.right) {
		reflected = true;
	} else if (input.left) {
		reflected = false;
	}

	if (reflected) {
		context.drawImage(sprite.canvas, x, position.y - image.height / 2);
	} else {
		context.drawImage(image, x, position.y - image.height / 2);
	}
});

},{"./lib/context":4,"./lib/input":6,"./lib/loop":7,"./lib/position":9}],3:[function(require,module,exports){
require('./ocean');
require('./carriers');
require('./helicopter');

},{"./carriers":1,"./helicopter":2,"./ocean":11}],4:[function(require,module,exports){
var canvas = document.getElementById('demo-canvas'),
	context = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

context.font = '20px Georgia';

module.exports = context;


},{}],5:[function(require,module,exports){

function Emitter() {
	this.listeners = { };
}

Emitter.prototype.on = function on(address, callback) {
	if (!this.listeners[address]) {
		this.listeners[address] = [ ];
	}

	this.listeners[address].push(callback);
};

Emitter.prototype.emit = function emit(address, data) {
	var listeners = this.listeners[address];

	if (!listeners) {
		return;
	}

	listeners.forEach(function each(listener) {
		listener(data);
	});
};

function spawn() {
	return new Emitter();
}

module.exports = spawn;

},{}],6:[function(require,module,exports){
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

},{}],7:[function(require,module,exports){
var registrants = [ ],
	last_tick = Date.now();


function loop() {
	var now = Date.now(),
		delta = now - last_tick;

	window.requestAnimationFrame(loop);

	if (delta < 16) {
		return;
	}

	last_tick = now;
	registrants.forEach(function each(registrant) {
		registrant(delta);
	});
}

function register(registrant) {
	registrants.push(registrant);
}

window.requestAnimationFrame(loop);

module.exports = {
	register: register
};

},{}],8:[function(require,module,exports){


function open(service) {
	window.open('http://' + service.host + ':' + service.port);
}

module.exports = {
	open: open
};

},{}],9:[function(require,module,exports){
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

},{"./input":6,"./loop":7,"./socket":10}],10:[function(require,module,exports){
var socket,
	connected = false,
	emitter = require('./emitter')();

emitter.send = send;
module.exports = emitter;

function pack(body) {
	var char = String.prototype.charCodeAt,
		index = body.length,
		buffer = new Uint8Array(index);

	while (index--) {
		buffer[index] = char.call(body[index]);
	}

	return buffer;
}

function send (body) {
	if (typeof body !== 'string') {
		body = JSON.stringify(body);
	}

	socket.send(pack(body));
}

function receive(payload) {
	var message;

	try {
		message = JSON.parse(payload.data);
	} catch (error) {
		console.warn(error);
		//TODO
		//handler
		return;
	}

	emitter.emit(message.address, message);
}

function onopen() {
	connected = true;
	emitter.emit('connected');
}

function onclose() {
	connected = false;
}

function onerror() {
	console.log(arguments);
}

function connect() {
	var path = 'ws://localhost:5050';

	socket = new WebSocket(path);
	socket.onerror = onerror;
	socket.onmessage = receive;
	socket.onopen = onopen;
	socket.onclose = onclose;
}

function disconnect() {
	if (connected) {
		socket.close();
	}
}

connect();

},{"./emitter":5}],11:[function(require,module,exports){
var loop = require('./lib/loop'),
	context = require('./lib/context');

loop.register(function tick(delta) {
	var y_offset = Math.floor(context.canvas.height * 0.75);

	context.clearRect(0, 0, context.canvas.width, context.canvas.height);
	context.fillStyle = '#bbf1ff';
	context.fillRect(0, 0, context.canvas.width, context.canvas.height);
	context.fillStyle = '#326eb1';
	context.fillRect(0, y_offset, context.canvas.width, context.canvas.height - y_offset);
});

},{"./lib/context":4,"./lib/loop":7}]},{},[3])
;