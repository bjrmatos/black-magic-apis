var sorcerer = require('sorcerer'),
	LandingRequest = require('./landing-request'),
	landing_requests = [ ],
	x = +process.argv[3] * -1;


var position = sorcerer.link('position', {
	description: 'The boat\'s position on the water',
	get: function(req, res, callback) {
		return void callback(null, {
			x: x,
			y: 0,
			velocity: 0
		});
	}
});

sorcerer.link('landing-requests', {
	cors: '*',
	description: 'Requests to land on this particular boat',
	get: function(req, res, callback) {
		return void callback(null, landing_requests);
	},
	post: function(req, res, callback) {
		var new_request = new LandingRequest(req.body);

		landing_requests.push(new_request);

		return void callback(null, new_request);
	},
	expects: {
		weight: {
			description: 'How much your aircraft weighs'
		},
		length: {
			description: 'Length of your aircraft, from tip to tail!'
		},
		time: {
			description: 'How long, in hours, your craft will be landed here'
		}
	}
}).link(':request', {
	description: 'Retrieve info on a particular landing request',
	get: function(req, res, callback) {
		var index = landing_requests.length,
			request;

		while (index--) {
			request = landing_requests[index];
			console.log(request.id);
			if (request.id === req.parameters.request) {
				return void callback(null, request);
			}
		}

		return void callback(new Error('the specified request ' + req.parameters.request + ' was not found'));
	}
});





