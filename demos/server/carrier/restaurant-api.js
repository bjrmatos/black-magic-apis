var sorcerer = require('sorcerer'),
	menu = require('./menu.json'),
	orders = { };

sorcerer.describe('API for ECMABurgers Fast Food');

sorcerer.link('menu', {
	description: 'A delicious list of tasty meals to satisfy a pilot\'s appetite',
	get: function(req, res, callback) {
		return void callback(null, menu);
	}
}).link(':item', {
	description: 'Information about a specific item on the menu',
	get: function(req, res, callback) {
		var item = +req.parameters.item;

		if (!menu[item - 1]) {
			return void callback({
				message: 'Item ' + item + ' not found'
			});
		}

		return void callback(null, menu[item - 1]);
	}
});

sorcerer.link('orders', {
	description: 'View submitted orders, or submit a new one!',
	get: function(req, res, callback) {
		var key,
			result = [ ];

		for (key in orders) {
			result.push(orders[key]);
		}

		return void callback(null, result);
	},
	post: function(req, res, callback) {
		var order = req.body;

		if (!order.id) {
			order.id = Math.random().toString(16).slice(3);
		}

		order.date = Date.now();
		order.items = order.items.map(function map(id) {
			return menu[id - 1];
		});

		orders[order.id] = order;

		return void callback(null, order);
	},
	expects: {
		items: {
			description: 'Array of ids for the items you want to order'
		}
	}
}).link(':order', {
	description: 'View order details for a specific order',
	get: function(req, res, callback) {
		var id = req.parameters.order;

		if (!orders[id]) {
			return void callback(new Error('Order ' + id + ' not found'));
		}

		return void callback(null, orders[id]);
	}
});
