var input = require('./lib/input'),
	promix = require('promix'),
	loop = require('./lib/loop'),
	acolyte = require('acolyte'),
	socket = require('./lib/socket'),
	position = require('./lib/position'),
	dialogue = require('./lib/dialogue'),
	settings = {
		weight: 150,
		length: 10,
		time: 5
	};

input.left = true;

function flyTo(x, callback) {
	input.left = true;
	loop.register(function looper(delta) {
		if (position.x > x) {
			return;
		}

		input.left = false;
		loop.unregister(looper);
		callback(null);
	});
}

function land(dummy, callback) {
	var last_y;

	input.down = true;

	loop.register(function looper(delta) {
		if (last_y && position.y === last_y) {
			input.down = false;
			loop.unregister(looper);
			return void callback(null);
		}

		last_y = position.y;
	});
}

function isArray(array) {
	return Object.prototype.toString.call(array) === '[object Array]';
}

socket.on('announce', function handler(carrier) {
	console.log('trying to find carrier:');
	console.log(carrier);
	var chain = promix.chain();

	input.left = false;

	acolyte.config({
		host: carrier.host,
		port: carrier.port
	});

	dialogue.say('Fetching info on carrier ' + carrier.id);

	chain.and(acolyte.position).as('position');
	chain.wait(1500).then(function interstitial(results) {
		var carrier_position;

		if (isArray(results.position)) {
			carrier_position = results.position[0];
		} else if (results.position.x !== undefined) {
			carrier_position = results.position.x;
		}

		if (carrier_position === undefined || carrier_position > position.x) {
			console.log(results.position);
			console.log(position.x);
			dialogue.say('Cannot land on carrier ' + carrier.id + ' -- wrong direction');
			return;
		}

		chain.and(dialogue.say, 'Going to try to land on ' + carrier.id);
		chain.and(acolyte.landing_requests).as('landings');

		chain.wait(1500).then(function interstitial(results) {
			var landings = results.landings.links.self,
				body = { },
				key;

			if (landings.expects) {
				for (key in landings.expects) {
					if (settings[key] !== undefined) {
						body[key] = settings[key];
					}
				}
			}

			chain.and(acolyte.landing_requests.push(body))
				.wait(1500)
				.then(dialogue.say, 'flying to ' + carrier.id + '\'s position')
				.then(flyTo, carrier_position)
				.wait(1500)
				.then(dialogue.say, 'starting landing sequence...')
				.then(land)
				.then(dialogue.say, 'yay! all done');
		});
	});

	chain.otherwise(function failure(error) {
		console.log(error);
		dialogue.say('There was an error when negotiating with carrier ' + carrier.id);
	});
});

socket.on('unannounce', function handler(carrier) {
});
