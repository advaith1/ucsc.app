DROP TABLE IF EXISTS class;
CREATE TABLE class (
	term INTEGER,
	id INTEGER,

	pisaLink VARCHAR(300),
	name VARCHAR(200),
	instructor VARCHAR(100),
	-- time VARCHAR(30),                  -- the original time string, remove later
	locationID INTEGER NOT NULL,

	PRIMARY KEY (term, id),
	FOREIGN KEY (locationID) REFERENCES location(locationID)
);

DROP TABLE IF EXISTS classTimeBlock;
CREATE TABLE classTimeBlock (
	term INTEGER,
	classID INTEGER,
	blockID INTEGER,

	FOREIGN KEY (term, classID) REFERENCES class(term, id),
	FOREIGN KEY (blockID) REFERENCES timeBlock(blockID)
);

DROP TABLE IF EXISTS location;
CREATE TABLE location (
	locationID INTEGER PRIMARY KEY,
	-- locationString VARCHAR(30),        -- the original location string, remove later
	building VARCHAR(30),
	room VARCHAR(10),

	UNIQUE (building, room)
);

DROP TABLE IF EXISTS timeBlock;
CREATE TABLE timeBlock (
	blockID   INTEGER PRIMARY KEY,
	day       TINYINT NOT NULL,      -- 0 mon, 1 tues, etc
	startTime TIME NOT NULL,
	endTime   TIME NOT NULL,

	UNIQUE (day, startTime, endTime)
);