var express = require('express');
var app = express();
var path = require('path');
var pg = require('pg');
var body_parser = require('body-parser');
var methodOverride = require('method-override');

// get all data/stuff of the body (POST) parameters
// parse application/json 
app.use(body_parser.json());
// parse application/vnd.api+json as json
app.use(body_parser.json({ type: 'application/vnd.api+json' }));
// // parse application/x-www-form-urlencoded
app.use(body_parser.urlencoded({ extended: true }));
// override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT
app.use(methodOverride('X-HTTP-Method-Override'));

var connectionString = process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/GBLS_db';

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname ));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');


/*************************************** FIREBASE ***************************************/
// The following code was made possible due to the DREAM team's app!
  HttpStatusCodes = {
    success:      { code: 200, description: "Success" },
    unauthorized: { code: 401, description: "Unauthorized" },
    notFound:     { code: 404, description: "Not Found" },
    serverError:  { code: 500, description: "Internal Sever Error" }
  }
var firefuncs = require('./firefuncs.js');
  
  // display the page to the user
  app.get('/login', function(req, res) {
    console.log('get /login');
    res.sendFile(path.join(__dirname, '/index.html'));
  });
  // log the user into firebase
  app.post('/login', function(req, res) {
  	console.log('post /login');
    // TODO: escape user input - should this happen on the front end?
    firefuncs.login(req.body.username, req.body.password, function(status, auth) {
      res.status(status);
      res.send(auth);
    });
  });
  
  // display the page to the user
  app.get('/logout', function(req, res) {
    res.sendFile(path.join(__dirname, '/index.html'));
  });
  // log the user out of firebase
  app.post('/logout', function(req, res) { // TODO: figure this out
    firefuncs.logout(function(un) {
      res.send(un);
    });
  });

  // display the page to the user
  app.get('/register', function(req, res) {
    res.sendFile(path.join(__dirname, '/index.html'));
  });
  // register the user with firebase
  app.post('/register', function(req, res) {
    firefuncs.register(req.body.username, req.body.password, req.body.password2, function(status, info) {
      res.status(status);
      res.send(info);
    });
  });

  // display the page to the user
  app.get('/deleteuser', function(req, res) {
    res.sendFile(path.join(__dirname, '/index.html'));
  });
  // delete the user from firebase
  app.post('/deleteuser', function(req, res) {
    firefuncs.deleteuser(req.body.username, req.body.password, function(status, info) {
      res.status(status);
      res.send(info);
    });
  });

  // display the page to the user
  app.get('/changePassword', function(req, res) {
    res.sendFile(path.join(__dirname, '/index.html'));
  });
  // delete the user from firebase
  app.post('/changePassword', function(req, res) {
    firefuncs.changePassword(req.body.username, req.body.oldpassword, req.body.newpassword, function(status, info) {
      res.status(status);
      res.send(info);
    });
  });

  // display the page to the user
  app.get('/changeEmail', function(req, res) {
    res.sendFile(path.join(__dirname, '/index.html'));
  });
  // delete the user from firebase
  app.post('/changeEmail', function(req, res) {
    firefuncs.changeEmail(req.body.oldusername, req.body.newusername, req.body.password, function(status, info) {
      res.status(status);
      res.send(info);
    });
  });

  // display the page to the user
  app.get('/resetPassword', function(req, res) {
    res.sendFile(path.join(__dirname, '/index.html'));
  });
  // delete the user from firebase
  app.post('/resetPassword', function(req, res) {
    firefuncs.resetPassword(req.body.username, function(status, info) {
      res.status(status);
      res.send(info);
    });
  });
  
  // get the current user
  app.get('/user', function(req, res) {
    var authData = firefuncs.getUser();
    res.send(authData);
  })

  // require authentication for all other routes - DOESN'T WORK...i don't know why
  app.use(function(req, res, next) {
    var authData = firefuncs.getUser();
    if (!authData) {
      
      if (req.xhr) { // if AJAX request
        console.log("unauthorized, ajax request");
        res.sendStatus(HttpStatusCodes.unauthorized.code);
      } else {
        console.log("unauthorized, redirecting to login");
        res.redirect("/login");
      }
    } else {
      next();
    }
  })
/*************************************** /FIREBASE ***************************************/

app.get('/', function(request, response) {
 	response.send("<p>home page</p>");
});

// Assuming we need data for all types of users
app.get('/allUserData', function(request,response) {
	var client = new pg.Client(connectionString);
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
	var client = new pg.Client(connectionString);
	console.log(request.query.lawyerID);
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
	var client = new pg.Client(connectionString);
	console.log(request.query);
	client.connect(function(err) {
		if (err) {
			console.log(err);
			// TODO: handle error
		}
	});
  var queryStr = "SELECT App_User.*, ARRAY_AGG(Client_Access.viewee) AS viewee FROM App_User \
        LEFT JOIN Client_Access \
        ON App_User.user_id = Client_Access.viewer \
        WHERE App_User.uname = '" + request.query.data +
        "'GROUP BY App_User.user_id;"
	var query = client.query(queryStr, function(err, res) {
		if (err) {
			console.log(err);
			// TODO: handle error
		} else {
			response.send(res.rows);
		}
	});
	
	query.on('end', function() { client.end();  });
});

// Given a userID, return response history
app.get('/historyData', function(request,response) {
	var client = new pg.Client(connectionString);
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

app.get('/history', function(request,response) {
	response.sendFile(path.join(__dirname, '/index.html'));
});

app.get('/admin', function(request,response) {
	response.sendFile(path.join(__dirname, '/index.html'));
});

app.get('/clientlist', function(request,response) {
	response.sendFile(path.join(__dirname, '/index.html'));
});

app.get('/clientview', function(request,response) {
	response.sendFile(path.join(__dirname, '/index.html'));
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});



// TODO: post request to save new user, post request to edit user, post request to save
// recording, currently all logged-in users can make a request
