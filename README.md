# Really Simple HTTP Server

*Really simple HTTP server for serving static files.*

I created this because python's [http.server](https://docs.python.org/3/library/http.server.html) can not serve javascript module file properly.
Browser will show this when I import other script in a module file.

> Failed to load module script: The server responded with a non-JavaScript MIME type of "text/plain". Strict MIME type checking is enforced for module scripts per HTML spec.

And I could not work around it.

---
### Usage
0. You have to have Node.js (and npm) first.
1. Install the package.
```
npm i git+https://github.com/thanglongnamnay/Really-Simple-HTTP-Server -g
```
2. Run 
```
rserver --path your-public-directory
```
or just run `rserver` on your public directory.

Run `rserver --help` to see all the commands.