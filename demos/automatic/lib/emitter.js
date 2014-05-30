
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
