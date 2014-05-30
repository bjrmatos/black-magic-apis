var clients = [ ],
	events = require('events'),
	emitter = new events.EventEmitter();

function connect(socket) {
	var client = {
		socket: socket,
		x: null,
		y: null,
		services: [ ]
	};

	clients.push(client);

	socket.on('message', function handler(message) {
		try {
			message = JSON.parse(message);
		} catch(error) {
			console.warn(error);
			return;
		}

		if (message.x !== undefined && message.y !== undefined) {
			client.x = message.x;
			client.y = message.y;
			emitter.emit('reposition', client);
		}
	});
}

module.exports = emitter;
emitter.connect = connect;
