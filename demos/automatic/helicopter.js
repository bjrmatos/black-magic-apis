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
