var server = require("http").createServer(handler),
	fs = require("fs");


server.listen(1339, "127.0.0.1");
console.log("server listening on port 1339 @" + __dirname);

function read(path) {
	var handlers = {}, result = {}, isCompleted;
	handlers.success = [];
	handlers.error = [];
	
	var promise = {
		success: function(func) {
			handlers.success.push(func);
			promise.resolve();
			
			return promise;
		},
		error: function(func) {
			handlers.error.push(func);
			promise.resolve();
			
			return promise;
		},
		resolve: function() {
			var func;
			if (!isCompleted) return;
		
			if (result.error) {
				while (func = handlers.error.shift()) func(result.error);
			} else {
				while (func = handlers.success.shift()) func(result.data);
			}
		}
	}
	
	fs.readFile(path, function(err, data) {
		isCompleted = true;
		result.error = err;
		result.data = data;
		promise.resolve();
	});
	
	return promise;
}
	
function handler(req, res) {
	console.log("requesting " + req.url);
	
	var path = req.url === "/"? "/index.html" : req.url;
	
	read(__dirname + path)
		.error(function(err) { 
			res.writeHead(500);
			res.end("Server error");
		})
		.error(function(err) {
			console.error(err);
		})
		.success(function(data) {
			console.log("get data success");
			res.writeHead(200, {"Content-Type": "text/html"});
			res.end(data);
		});
}