var server = require("http").createServer(handler),
	fs = require("fs");
	
server.listen(1338, "127.0.0.1");
console.log("server started on port 1338");


function handler(req, res) {
	console.log("requesting " + req.url);
	
	fs.readFile(__dirname + "/index.html", function(err, data) {
		if (err) {
			res.writeHead(500);
			return res.end("Error loading index.html");
		}
		
		res.writeHead(200, {"Content-Type": "text/html"});
		res.end(data);
	});
}

