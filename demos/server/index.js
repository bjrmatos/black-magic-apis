var http = require('http'),
	server,
	ws = require('ws'),
	sockets = require('./sockets'),
	announcer = require('./announcer');

server = new ws.Server({
	server: http.createServer().listen(5050)
});

server.on('connection', sockets.connect);
