var server = require("http").createServer(handler),
	io = require("socket.io").listen(server),
	fs = require("fs"),
	isInit;
	
server.listen(1340, "127.0.0.1");
console.log("listening on port 1340");

function handler(req, res) {
	if (req.url === "/") {
		fs.readFile(__dirname + "/index.html", function(err, data) {
			if (err) {
				res.writeHead(500);
				res.end("server error");
			} else {
				res.writeHead(200, {"Content-Type": "text/html"});
				res.end(data);
			}
		});
	}
}

io.sockets.on("connection", function(socket) {
	io.sockets.emit("sync", { date: new Date(), id: socket.id, text: "entered." });
	
	socket.on("message", function(data) {
		io.sockets.emit("sync", { date: "", id: socket.id, text: data });
	});
	
	socket.on("disconnect", function(data) {
		io.sockets.emit("sync", { date: new Date(), id: socket.id, text: "left." });
	});
});