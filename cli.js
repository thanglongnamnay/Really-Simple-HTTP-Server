#!/usr/bin/env node
const http = require('http');
const { basename, extname, join } = require('path');
const { createReadStream } = require('fs');
const { exec } = require('child_process');
const parseArgv = require('./parseArgv');
const { lastItem, isDirectory, fileExist, unary } = require('./utility');

const notFound = res => {
	res.statusCode = 404;
		
	return res.end();
}

const onListen = ({ root = '.', exceptionalFiles = [] }) => async (req, res) => {
	console.log(req.method, req.url);

	// Serve static files only.
	if (req.method !== 'GET') return req.end();

	// Get the source to the file to serve.
	let source = join(root, ...req.url.split('?')[0].split('/'));
	if (!await fileExist(source)) {
		return notFound(res);
	}

	// isDirectory could throw error, 
	// but we checked for file existence with fileExist.
	// So it's really hard to throw an error here.
	// A try catch is almost redundant here.
	if (await isDirectory(source)) {
		if (lastItem(req.url) !== '/') {
			// redirect to url which end with a slash
			res.writeHead(301, { "Location": req.url + '/' });
			
			return res.end();
		}

		// Point source to index.html if request url is a folder.
		// You can introduce a new variable for clarity.
		source = join(source, 'index.html');
		if (!await fileExist(source)) {
			return notFound(res);
		}

		res.writeHead(200, {"Content-Type": "text/html"}); 
	}

	// Respond a not found when request an exceptional file.
	if (exceptionalFiles.some(e => e.test(basename(source)))) {
		return notFound(res);
	}

	// js file request should be responded with correct mime type.
	// TODO: Handle other mime types.
	if (extname(source) === '.js') {
		res.writeHead(200, {"Content-Type": "text/javascript"}); 
	}
	createReadStream(source).pipe(res);
}

let options;
try {
	options = parseArgv(['--help', '--port', '--path', '--exception'], true)(process.argv);
} catch (e) {
	console.error(e.message);
	process.exit(1);
}

if (options['--help'] != undefined) {
	createReadStream(join(__dirname, 'help.txt')).pipe(process.stdout);
} else {
	const port = parseInt(options['--port']) || 3000;
	const root = options['--path'] || '.';
	const exceptionalFiles = options['--exception'] ? options['--exception'].split(' ').map(unary(RegExp)) : [];

	http.createServer(onListen({ root, exceptionalFiles }))
		.listen(port, err => {
			if (err) throw err;
			exec('start http://localhost:' + port);
			console.log('Server is listening on ' + port);
		});
}
