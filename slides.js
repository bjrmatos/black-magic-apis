var charm = require('charm')(process.stdin),
	fs = require('fs'),
	tube = require('picture-tube'),
	slides = [
		'intro',
		'etsy',
		'rest',
		'hates',
		'ocean'
	],
	working = false;

index = 0;

function draw() {
	var slide_name = slides[index],
		stream = fs.createReadStream('./slides/' + slide_name + '.png').pipe(tube()),
		text_items = JSON.parse(fs.readFileSync('./slides/' + slide_name + '.json', 'utf8'));

	working = true;
	stream.pipe(process.stdout);
	stream.on('end', function handler() {
		text_items.forEach(function each(item) {
			charm.position(item.x, item.y);
			charm.write(item.message);
		});

		working = false;
	});
}

function next() {
	var stream;

	if (index === slides.length - 1) {
		return;
	}

	index++;
	draw();
}

function prev() {
	if (index === 0) {
		return;
	}

	index--;
	draw();
}

charm.pipe(process.stdout);
charm.reset();
charm.cursor(false);

charm.on('data', function handler(data) {
	if (working || data.length !== 3 || data[0] !== 27 || data[1] !== 91) {
		return;
	}

	if (data[2] === 68) {
		prev();
	} else if (data[2] === 67) {
		next();
	}
});

draw();


