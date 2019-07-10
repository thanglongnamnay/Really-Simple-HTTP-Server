# Really Simple HTTP Server

*Really simple HTTP server for serving static files.*

I created this because python's [http.server](https://docs.python.org/3/library/http.server.html) can not serve javascript module file properly.
Browser will show this when I import other script in a module file.

> Failed to load module script: The server responded with a non-JavaScript MIME type of "text/plain". Strict MIME type checking is enforced for module scripts per HTML spec.

And I could not work around it.

## Usage
0. You have to have Node.js (and npm) first.
1. Install the package.
```bash
$ npm i really-simple-http-server -g
```
2. Run 
```bash
$ rserver --path your-public-directory
```
or just run `$ rserver` on your public directory.

## Debug
On Unix, run `Debug=tlnn:rserver rserver [your params]`.
On Windows, run `set Debug=tlnn:rserver & rserver [your params]`.

Run `$ rserver --help` to see all the commands.

## APIs
`really-simple-http-server` exposes a function. Simply pass an option object to this function and call `start` method to run the server, and call `stop` whenever you feel like it.
```js
const rserver = require('./really-simple-http-server');

const options = {
	path: './public',
	port: 8080,
}

const server = rserver(options);
server.start(err => {
	if (err) throw err;
	// Do some stuff
});

// Do other things

server.stop();
```

### ReallySimpleHTTPServer([options])
* `options` {Object} Set of configurable options to set on the server.  Can have the following fields:
	* `help` {boolean} Display help instead of start server (should be use in cli only). Default: `false`.
	* `port` {number} The port for server to listen on. Default: 3000.
	* `path` {string} The path where server serve as root folder. Default: current directory.
	* `exception` {RegExp[]|string[]} Files that will not be serve (respond a 404). For example: `{ exception: [/.*css/, /.*js/] }`. Default: `[]`.
	* `exceptions` {RegExp|string} Same as `exception`.
* Return: {ReallySimpleHTTPServer}

### reallySimpleHTTPServer.start([callback])
* `callback` {Function} 
	* `err` {Error}
	* `server` {http.Server}

Start the server. The callback is passed two arguments  `(err, server)`, where  `server`  is the {http.Server} object which is listening. The callback is called after server successfully listening.

### reallySimpleHTTPServer.stop([callback])
* `callback` {Function} 

Stop the server from accepting new connections.
