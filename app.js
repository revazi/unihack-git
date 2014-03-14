var express = require("express");
var app = express();
var port = Number(process.env.PORT || 5000);
// var port = 3700;
var io = require('socket.io');
var fs = require('fs');
var body = '';
var commitsStore = 'commits.json';
var commits = [];
var currentCommit = {};


// templates destinations
app.set("views", __dirname + "/tpl");
// template engine
app.set("view engine", "jade");
app.engine('jade', require('jade').__express);

// front end files and folders
app.use(express.static(__dirname + '/public'));

app.get("/", function(req, res){
	res.render("index");
});

app.post("/send", function(req, res){
	
	req.addListener('data', function(chunk){
		console.log('Got a chunk');
		body += chunk;
	});

	req.addListener('error', function(error){
		console.log('got an error');
		next(err);
	});

	req.addListener('end', function(chunk){

		console.log('ended');
		if(chunk) {
			body += chunk;
			io.sockets.emit('message', body);
		}
		// parse a resulted body of the payload
		body = JSON.parse(body);
		
		// read file before writing into them
        fs.readFile(commitsStore, function(err,data){
            if(err){
                console.log('error while reading file');            
            } else {
                if(data.length) {
                    commits = JSON.parse(data);
                } else {
                    commits = [];
                }
            }
            console.log('commits ' + commits);
        });


		// add new element to the commits array and stringify for later writing in the file
		commits.unshift(body);
        if(commits.length > 10) {
            commits.pop();   
        }
        commits = JSON.stringify(commits);
		
		// write commits array to a file
		fs.writeFile(commitsStore, commits, function(err){
            if(err){
                console.log("couldn't write to a fiel");
            } else {
                console.log("file was written");
            }
        });
		
		// emit message to the socket for the client to display commit card
        io.sockets.emit('message', body);
        
        /* clear body for the next commit */
        body = '';
/* 		console.log('full body', body); */
		res.end("I've got your data");
	});

});
io = io.listen(app.listen(port));

io.configure(function () { 
  io.set("transports", ["xhr-polling"]); 
  io.set("polling duration", 10); 
});


io.sockets.on('connection', function(socket){
    fs.readFile(commitsStore, function(err,data){
        if(err){
            console.log('error while reading file');            
        } else {
            if(data.length) {
                commits = JSON.parse(data);
                socket.emit('commits', commits);
            } else {
                commits = [];
            }
        }
    });
});




console.log("Listenint on port " + port);