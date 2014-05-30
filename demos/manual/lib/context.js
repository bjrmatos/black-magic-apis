var canvas = document.getElementById('demo-canvas'),
	context = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

context.font = '20px Georgia';

module.exports = context;

