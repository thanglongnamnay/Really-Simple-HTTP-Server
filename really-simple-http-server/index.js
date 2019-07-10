const http = require('http');
const debug = require('debug')('tlnn:rserver');
const { basename, extname, join } = require('path');
const { createReadStream } = require('fs');
const { exec } = require('child_process');
const { lastItem, isDirectory, fileExist, unary } = require('../utility');

const notFound = res => {
	res.statusCode = 404;
		
	return res.end();
}

const onListen = ({ root = '.', exceptionalFiles = [] }) => async (req, res) => {
	debug(req.method, req.url);

	// Serve static files only.
	if (req.method !== 'GET') return notFound(res);

	// Get the source to the file to serve.
	// Should I use url.parse?
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
			// redirect to url which ends with a slash.
			res.writeHead(301, { "Location": req.url + '/' });
			
			return res.end();
		}

		// Point source to index.html if request url is a folder.
		// You can introduce a new variable for clarity.
		// Should I use url.resolve?
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
const showHelp = (callback = () => {}) => {
	const helpStream = createReadStream(join(__dirname, 'help.txt'));
	helpStream.pipe(process.stdout);
	helpStream.on('end', callback);
};

const ReallySimpleHTTPServer = (options = {}) => {
	let server;
	return {
		start(callback = () => {}) {
			if (options.help) {
				return showHelp(callback);
			} else {
				const port = parseInt(options.port) || 3000;
				const root = options.path || '.';
				const exceptionalFiles = options.exceptions ? options.exceptions.map(unary(RegExp)) : [];

				server = http.createServer(onListen({ root, exceptionalFiles }))
					.listen(port, err => {
						if (err) {
							callback(err);
						} else {
							exec('start http://localhost:' + port);
							debug('Server is listening on ' + port);
							callback(null, server);
						}
					});
			}
		},
		stop(callback = () => {}) {
			server.close(callback);
		},
	}
}

module.exports = ReallySimpleHTTPServer;