var sorcerer = require('sorcerer'),
	http = require('http'),
	args = require('minimist')(process.argv),
	server = http.createServer().listen(+args._[2]);

require('./api');

if (Math.random() > 0.5 || +args._[3] > 10000) {
	require('./restaurant-api');
}

sorcerer.attach(server);
sorcerer.describe('List of options for interacting with this aircraft carrier');
