const http = require('http');
const fs = require('fs');
const port = 1234;
http.createServer(function(request, response) {
    console.log(request.url);
    if(request.url.includes('.js')) {
        response.writeHead(200, {'Content-Type': 'text/javascript'});
        fs.createReadStream('.' + request.url).pipe(response);
    } else if(request.url.includes('.png')) {
        response.writeHead(200, {'Content-Type': 'image/png'});
        fs.createReadStream('.' + request.url).pipe(response);
    } else if(request.url.includes('.html')){
        response.writeHead(200, {'Content-Type': 'text/html'});
        fs.createReadStream('.' + request.url).pipe(response);
    } else {
        response.writeHead(200, {'Content-Type': 'text/html'});
        fs.createReadStream('index.html').pipe(response);
    }
}).listen(port);

//serve.js sorgt dafür, dass ein Webserver gestartet wird auf Grundlage der Dateien index.html und snake.js
//Port ist 1234