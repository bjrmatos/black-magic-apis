var registrants = [ ],
	last_tick = Date.now();


function loop() {
	var now = Date.now(),
		delta = now - last_tick;

	window.requestAnimationFrame(loop);

	if (delta < 16) {
		return;
	}

	last_tick = now;
	registrants.forEach(function each(registrant) {
		registrant(delta);
	});
}

function register(registrant) {
	registrants.push(registrant);
}

function unregister(registrant) {
	registrants.splice(registrants.indexOf(registrant), 1);
}

window.requestAnimationFrame(loop);

module.exports = {
	register: register,
	unregister: unregister
};
