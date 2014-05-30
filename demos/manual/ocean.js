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
