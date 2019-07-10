#!/usr/bin/env node
const rserver = require('./really-simple-http-server');
const parseArgv = require('./parseArgv');

const optionParams = [
		'--help',
		'--port',
		'--path',
		'--exception',
		'--exceptions',
	];

try {
	let options = parseArgv(optionParams, true)(process.argv);
	const exceptions = options['--exceptions'] || options['--exception'];

	// should i do this kind of mutation?
	options = {
		...options,
		help: options['--help'] != undefined, // option['--help'] should be a string
		port: options['--port'],
		path: options['--path'],
		exceptions: exceptions ? exceptions.split(' ') : [],
	};

	rserver(options).start();
} catch (e) {
	console.error(e.message);
	process.exit(1);
}
