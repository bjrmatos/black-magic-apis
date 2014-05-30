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
