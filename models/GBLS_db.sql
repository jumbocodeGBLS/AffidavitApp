CREATE TYPE user_type as ENUM ('client','lawyer','admin','other');
CREATE TABLE App_User(
	user_id 	INT NOT NULL PRIMARY KEY,
	fname 		VARCHAR,
	lname 		VARCHAR,
	username	VARCHAR,
	user_type	user_type
);

CREATE TABLE Client_Access
(
	viewer INT NOT NULL,
	CONSTRAINT fk_viewer FOREIGN KEY (viewer) REFERENCES App_User(user_id),
	viewee INT NOT NULL,
	CONSTRAINT fk_viewee FOREIGN KEY (viewee) REFERENCES App_User(user_id),
	PRIMARY KEY (viewer,viewee)
);

CREATE TABLE Affidavit
(
	aff_id	INT NOT NULL PRIMARY KEY,
	client	INT NOT NULL,
	CONSTRAINT fk_client FOREIGN KEY (client) REFERENCES App_User(user_id),
	a_date	date
);

CREATE TABLE Response
(
	affidavit 			INT NOT NULL,
	CONSTRAINT fk_aff FOREIGN KEY (affidavit) REFERENCES Affidavit(aff_id),
	q_num				INT NOT NULL,
	rec_num				INT NOT NULL,
	transcription_url	VARCHAR,
	recording_url		VARCHAR,
	time				TIMESTAMP,
	PRIMARY KEY (affidavit,q_num,rec_num)
);

/* The following is a table designed primarily for tracking usage of the app.
	I know we discussed leaving this table out, but the justification was based
	on authentication stuff, but that's not what the intention of this table is.
	I don't know if front-end has already done usage-tracking stuff, butthe table
	is small and was quick to code so I just did it anyway. */

CREATE TABLE Login
(
	user 		INT NOT NULL,
	CONSTRAINT fk_user FOREIGN KEY (user) REFERENCES App_User(user_id),
	login_time	TIMESTAMP NOT NULL,
	logout_time	TIMESTAMP,
	PRIMARY KEY (user,login_time)
)