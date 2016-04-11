var pg = require('pg');
var connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/todo';

var client = new pg.Client(connectionString);
client.connect();
var query = client.query('CREATE TABLE App_User(
	user_id 	INT NOT NULL PRIMARY KEY,
	fname 		VARCHAR,
	lname 		VARCHAR,
	username	VARCHAR,
	user_type	user_type
)');
query.on('end', function() { client.end(); });

