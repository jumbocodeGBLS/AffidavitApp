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

// Assuming we need data for all types of users
app.get('/allUserData', function(request,response) {
	client.connect(function(err) {
		if (err) {
			console.log(err);
			// TODO: handle error
		}
	});
	var queryStr = 'SELECT App_User.*, Client_Access.viewee FROM App_User LEFT JOIN \
					Client_Access ON App_User.user_id = Client_Access.viewer';
	var query = client.query(queryStr, function(err, res) {
		if (err) {
			console.log(err);
			// TODO: handle error
		} else {
			response.send(res.rows);
		}
	});
	query.on('end', function() { client.end(); });
});

app.get('/clientlistData', function(request, response) {
	client.connect(function(err) {
		if (err) {
			console.log(err);
			// TODO: handle error
		}
	});

	// clients for a specific lawyer, lawyer ID hardcoded for now, expecting it from frontend
	var queryStr = "SELECT fname, progress, user_id FROM App_User WHERE user_id in \
					(SELECT viewee FROM Client_Access WHERE viewer = " + request.query.lawyerID + ")";
	var query = client.query(queryStr, function(err, res) {
		if (err) {
			console.log(err);
			// TODO: handle error
		} else {
			response.send(res.rows);
		}
	});
	query.on('end', function() { client.end(); });
});

// should actually be the same as /admin
app.get('/userData', function(request,response) {
	client.connect(function(err) {
		if (err) {
			console.log(err);
			// TODO: handle error
		}
	});
  var queryStr = "SELECT App_User.*, ARRAY_AGG(Client_Access.viewee) AS viewee FROM App_User \
        LEFT JOIN Client_Access \
        ON App_User.user_id = Client_Access.viewer \
        WHERE App_User.user_id =" + request.query.userID +
        "GROUP BY App_User.user_id;"
	var query = client.query(queryStr, function(err, res) {
		if (err) {
			console.log(err);
			// TODO: handle error
		} else {
			response.send(res.rows);
		}
	});
	query.on('end', function() { client.end(); });
});

// Given a userID, return response history
app.get('/historyData', function(request,response) {
	client.connect(function(err) {
		if (err) {
			console.log(err);
			// TODO: handle error
		}
	});
  var queryStr = "SELECT q_id, txt, ARRAY_AGG(time) as date, ARRAY_AGG(recording_url) as link \
                  FROM response LEFT JOIN question ON question.q_id=response.q_num \
                  WHERE response.affidavit = (SELECT aff_id FROM affidavit WHERE client ="
                  + request.query.clientID + ") \
                  GROUP BY q_id;"
  var query = client.query(queryStr, function(err, res) {
		if (err) {
			console.log(err);
			// TODO: handle error
		} else {
			response.send(res.rows);
		}
	});
	query.on('end', function() { client.end(); });
});

app.get('/clientview', function(request,response) {
	response.sendFile(path.join(__dirname, '/index.html'));
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
