#!/usr/bin/env node
const http = require('http');
const { basename, join } = require('path');
const { createReadStream } = require('fs');
const { exec } = require('child_process');
const parseArgv = require('./parseArgv');
const { isDirectory, fileExist, fileExtension, unary } = require('./utility');

const onListen = ({ root = '.', exceptionalFiles = [] }) => async (req, res) => {
	console.log(req.method, req.url);

	// Serve static files only.
	if (req.method !== 'GET') return req.end();

	// Get the source to the file to serve.
	let source = join(root, ...req.url.split('?')[0].split('/'));
	if (await fileExist(source)) {
		// isDirectory could throw error, 
		// but we checked for file existence with fileExist.
		// So it's really hard to throw an error here.
		// A try catch is almost redundant here.
		if (await isDirectory(source)) {
			if (req.url[req.url.length - 1] !== '/') {
				// Folder url should end with a slash
				res.writeHead(301, { "Location": req.url + '/' });
				
				return res.end();
			}

			// Point source to index.html if request url is a folder.
			source = join(source, 'index.html');
			res.writeHeader(200, {"Content-Type": "text/html"}); 
		}

		// Respond a not found when request an exceptional file.
		if (exceptionalFiles.some(e => e.test(basename(source)))) {
			res.statusCode = 404;
			
			return res.end();
		}

		// js file request should be responded with correct mime type.
		// TODO: Handle mime type.
		if (fileExtension(source) === 'js') {
			res.writeHeader(200, {"Content-Type": "text/javascript"}); 
		}

		createReadStream(source).pipe(res);
	} else {
		res.statusCode = 404;

		return res.end();
	}
}

const option = parseArgv(['--help', '--port', '--path', '--exception'], true)(process.argv);

if (option['--help'] != undefined) {
	createReadStream('./help.txt').pipe(process.stdout);
} else {

	const port = parseInt(option['--port']) || 3000;
	const root = option['--path'] || '.';
	const exceptionalFiles = (option['--exception'] || '').split(' ').map(unary(RegExp));

	http.createServer(onListen({ root, exceptionalFiles }))
		.listen(port, err => {
			if (err) throw err;
			exec('start http://localhost:' + port);
			console.log('Server is listening on ' + port);
		});
	}
