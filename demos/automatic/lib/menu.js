

function open(service) {
	window.open('http://' + service.host + ':' + service.port);
}

module.exports = {
	open: open
};
