var express = require('express');
var app = express();
var path = require('path');
var pg = require('pg');

var connectionString = process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/GBLS_db';
var client = new pg.Client(connectionString);

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname ));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
 	response.send("<p>home page</p>");
});

app.get('/admin', function(request,response) {
	client.connect(function(err) {
		if (err) {
			console.log(err);
		}
	});
	var queryStr = 'SELECT App_User.*, Client_Access.viewee FROM App_User LEFT JOIN Client_Access ON App_User.user_id = Client_Access.viewer';
	var query = client.query(queryStr, function(err, res) {
		if (err) {
			console.log(err);
		} else {
			response.send(res.rows);
		}
	});
	query.on('end', function() { client.end(); });
});

app.get('/login', function(request,response) {
	response.sendFile(path.join(__dirname, '/index.html'));
});

app.get('/history', function(request,response) {
	response.sendFile(path.join(__dirname, '/index.html'));
});

app.get('/clientview', function(request,response) {
	response.sendFile(path.join(__dirname, '/index.html'));
});

app.get('/clientlist', function(request,response) {
	response.sendFile(path.join(__dirname, '/index.html'));
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
