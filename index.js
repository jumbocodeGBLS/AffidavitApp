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
// override with the X-HTTP-Method-Override header in the request.
app.use(methodOverride('X-HTTP-Method-Override'));

var connectionString = process.env.DATABASE_URL ||
                       'postgres://postgres:postgres@localhost:5432/GBLS_db';

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname ));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');


/*************************************** FIREBASE ****************************/
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
    firefuncs.login(req.body.username,
                    req.body.password,
                    function(status, auth) {
        res.status(status);
        res.send(auth);
    });
});
  
// display the page to the user
app.get('/logout', function(req, res) {
    res.sendFile(path.join(__dirname, '/index.html'));
});
// log the user out of firebase
app.post('/logout', function(req, res) {
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
    firefuncs.register(req.body.username,
                       req.body.password,
                       req.body.password2,
                       function(status, info) {
        res.status(status);
        res.send(info);
    });
});

// display the page to the user
app.get('/deleteuser', function(req, res) {
    res.sendFile(path.join(__dirname, '/index.html'));
});
// delete the user from firebase
// user is never actually deleted from the postgres database, as that would
// interfere with other tables etc.
app.post('/deleteuser', function(req, res) {
    firefuncs.deleteuser(req.body.username,
                         req.body.password,
                         function(status, info) {
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
    firefuncs.changePassword(req.body.username,
                             req.body.oldpassword,
                             req.body.newpassword,
                             function(status, info) {
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
    firefuncs.changeEmail(req.body.oldusername,
                          req.body.newusername,
                          req.body.password,
                          function(status, info) {
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

// require authentication for all other routes
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
    client = new pg.Client(connectionString);
    client.connect(function(err) {
        if (err) {
            console.log(err);
            // TODO1: handle error
        }
    });
    var queryStr = "SELECT App_User.*, Client_Access.viewee FROM App_User \
                    LEFT JOIN Client_Access \
                    ON App_User.user_id = Client_Access.viewer;";
    var query = client.query(queryStr, function(err, res) {
        if (err) {
            console.log(err);
            // TODO1: handle error
        } else {
            response.send(res.rows);
        }
    });
    query.on('end', function() { client.end(); });
});

app.get('/clientlistData', function(request, response) {
    client = new pg.Client(connectionString);
    console.log(request.query.lawyerID);
    client.connect(function(err) {
        if (err) {
            console.log(err);
            // TODO1: handle error
        }
    });

    // clients for a specific lawyer
    // lawyer ID hardcoded for now, expecting it from frontend
    var queryStr = "SELECT * FROM App_User \
                    WHERE user_id in \
                        (SELECT viewee FROM Client_Access \
                         WHERE viewer = $1::int);";
    var query = client.query(queryStr,
                             [request.query.lawyerID],
                             function(err, res) {
        if (err) {
            console.log(err);
            // TODO1: handle error
        } else {
            response.send(res.rows);
        }
    });

    query.on('end', function() { client.end(); });
});

// should actually be the same as /admin
app.get('/userData', function(request,response) {
    client = new pg.Client(connectionString);
    client.connect(function(err) {
        if (err) {
            console.log(err);
            // TODO1: handle error
        }
    });
    var queryStr = "SELECT App_User.*, \
                           ARRAY_AGG(Client_Access.viewee) AS viewee \
                    FROM App_User \
                    LEFT JOIN Client_Access \
                        ON App_User.user_id = Client_Access.viewer \
                    WHERE App_User.uname = $1::text \
                    GROUP BY App_User.user_id;";
    var query = client.query(queryStr, [request.query.data], function(err, res) {
        if (err) {
            console.log(err);
            // TODO1: handle error
        } else {
            response.send(res.rows);
        }
    });

    query.on('end', function() { client.end();  });
});

// Given a userID, return response history
// TODO2: also call from clientview page to get past recordings
app.get('/historyData', function(request,response) {
    client = new pg.Client(connectionString);
    client.connect(function(err) {
        if (err) {
            console.log(err);
            // TODO1: handle error
        }
    });
    var queryStr = "SELECT q_id, \
                           txt, \
                           ARRAY_AGG(transcription_url) as transcript_link, \
                           ARRAY_AGG(time) as date, \
                           ARRAY_AGG(recording_url) as link \
                    FROM response \
                    LEFT JOIN question ON question.q_id=response.q_num \
                    WHERE response.affidavit = \
                        (SELECT aff_id FROM affidavit WHERE client = $1::int) \
                    GROUP BY q_id;";
    var query = client.query(queryStr,
                           [request.query.clientID],
                           function(err, res) {
        if (err) {
            console.log(err);
            // TODO1: handle error
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


// TODO: currently all logged-in users can make a request

// called from admin page
app.post('/createUser', function(request, response) {
    client = new pg.Client(connectionString);
    client.connect(function(err) {
        if (err) {
            console.log(err);
            // TODO1: handle error
        }
    });
    var queryStr = "INSERT into app_user (user_id, \
                                          fname, \
                                          lname, \
                                          uname, \
                                          language, \
                                          progress, \
                                          type) \
                    VALUES ((SELECT max(user_id) from app_user) + 1, \
                            $1::text, \
                            $2::text, \
                            $3::text, \
                            $4::text, \
                            $5::int, \
                            $6::user_type);";
    var query = client.query(queryStr,
                             [request.body.fname,
                              request.body.lname,
                              request.body.uname,
                              request.body.language,
                              request.body.progress,
                              request.body.typestr],
                             function(err, res) {
        if (err) {
            console.log(err);
            // TODO1: handle error
        } else {
            var get_user_id = function(err, res) {
                if (err) {
                    console.log(err);
                } else {
                    response.send(res.rows[0]);
                }
            };
            next_query = client.query("SELECT max(user_id) from app_user;",
                                      get_user_id)
        }
    });
    query.on('end', function() { client.end(); });
});


// called from admin page
app.post('/updateUser', function(request, response) {
    client = new pg.Client(connectionString);
    client.connect(function(err) {
        if (err) {
            console.log(err);
            // TODO1: handle error
        }
    });
    var queryStr = "UPDATE app_user SET fname=$1::text, \
                                        lname=$2::text, \
                                        uname=$3::text, \
                                        language=$4::text, \
                                        progress=$5::int, \
                                        type=$6::user_type \
                    WHERE user_id=$7::int;";
    var query = client.query(queryStr,
                             [request.body.fname,
                              request.body.lname,
                              request.body.uname,
                              request.body.language,
                              request.body.progress,
                              request.body.typestr,
                              request.body.user_id],
                             function(err, res) {
        if (err) {
            console.log(err);
            // TODO1: handle error
        } else {
            response.send(res.rows);
        }
    });
    query.on('end', function() { client.end(); });
});

// called from admin page
app.post('/createAssignment', function(request,response) {
    client = new pg.Client(connectionString);
    client.connect(function(err) {
      if (err) {
          console.log(err);
          // TODO1: handle error
      }
    });
    var queryStr = "INSERT into client_access (viewer, viewee) \
                    VALUES ($1::int, \
                            $2::int);";
    var query = client.query(queryStr,
                             [request.body.viewer,
                              request.body.viewee],
                             function(err, res) {
        if (err) {
            console.log(err);
            // TODO1: handle error
        } else {
            response.send(res.rows);
        }
    });
    query.on('end', function() { client.end(); });
});

// called from admin page
app.post('/deleteAssignment', function(request, response) {
    client = new pg.Client(connectionString);
    client.connect(function(err) {
      if (err) {
          console.log(err);
          // TODO1: handle error
      }
    });
    var queryStr = "DELETE FROM client_access \
                    WHERE viewer=$1::int AND viewee=$2::int;";
    var query = client.query(queryStr,
                             [request.body.viewer,
                              request.body.viewee],
                             function(err, res) {
        if (err) {
            console.log(err);
            // TODO1: handle error
        } else {
            response.send(res.rows);
        }
    });
    query.on('end', function() { client.end(); });
});

// called when client created
app.post('/createAffidavit', function(request, response) {
    client = new pg.Client(connectionString);
    client.connect(function(err) {
      if (err) {
          console.log(err);
          // TODO1: handle error
      }
    });
    var queryStr = "INSERT INTO affidavit (aff_id, client, a_date) \
                    VALUES ((SELECT max(aff_id) from affidavit) + 1, \
                            $1::int, \
                            $2::date);";
    var query = client.query(queryStr,
                             [request.body.user_id,
                              request.body.datetime],
                             function(err, res) {
        if (err) {
            console.log(err);
            // TODO1: handle error
        } else {
            response.sendStatus(200);
        }
    });
    query.on('end', function() { client.end(); });
});

// TODO: ? how are we going to do this?
// TODO2: called when client records new response
app.post('/addResponse', function(request, response) {
    client = new pg.Client(connectionString);
    client.connect(function(err) {
      if (err) {
          console.log(err);
          // TODO1: handle error
      }
    });
    var queryStr = "INSERT INTO response (affidavit, \
                                          q_num, \
                                          rec_num, \
                                          transcription_url, \
                                          recording_url, \
                                          time) \
                    VALUES ($1::int, \
                            $2::int, \
                            $3::int, \
                            $4::text, \
                            $5::text, \
                            $6::text);";
    var query = client.query(queryStr,
                             [request.body.affidavit,
                              request.body.q_num,
                              request.body.rec_num,
                              request.body.transcription_url,
                              request.body.recording_url,
                              request.body.datetime],
                             function(err, res) {
        if (err) {
            console.log(err);
            // TODO1: handle error
        } else {
            response.send(res.rows);
        }
    });
    query.on('end', function() { client.end(); });
});


// TODO: are we pulling video URLs and dependencies from the database?
