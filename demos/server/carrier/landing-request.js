
module.exports = LandingRequest;

function LandingRequest(parameters) {
	this.weight = parameters.weight;
	this.time = parameters.time;
	this.length = parameters.length;
	this.date = Date.now();
	this.id = Math.random().toString(16).slice(3);
}
