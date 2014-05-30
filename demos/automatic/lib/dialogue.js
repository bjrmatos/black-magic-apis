var context = require('./context'),
	loop = require('./loop'),
	position = require('./position'),
	current_message;



loop.register(function draw(delta) {
	if (current_message) {
		context.fillText(current_message, window.innerWidth / 2, position.y - 64);
	}
});


function say(message, callback) {
	current_message = message;
	setTimeout(function() {
		current_message = null;
		if (callback) {
			callback(null);
		}
	}, 1500);
}

module.exports = {
	say: say
};
