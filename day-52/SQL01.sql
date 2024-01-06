-- creating TABLE named 'courses' and 'teacher'
CREATE TABLE courses(
	id integer NOT NULL,
	name character varying(50) NOT NULL,
	price real,
	detail text,
	teacher_id integer NOT NULL,
	active integer,
	created_at timestamp DEFAULT now(),
	updated_at timestamp DEFAULT now(),
	PRIMARY KEY (id)
);

CREATE TABLE teacher(
	id integer NOT NULL,
	name character varying(50) NOT NULL,
	bio text,
	created_at timestamp DEFAULT now(),
	updated_at timestamp DEFAULT now(),
	PRIMARY KEY (id)
);

-- adding column 'description' data-type: text, is nullable
ALTER TABLE courses
ADD COLUMN description text NULL;

-- renaming column 'detail' to 'content'
ALTER TABLE courses
RENAME COLUMN detail TO content;

-- altering column 'content', set commitment to "not nullable"
ALTER TABLE courses
ALTER COLUMN content 
SET NOT NULL;

-- reordering columns so that 'description' is before 'detail':
-- creating view from old_courses
CREATE VIEW original_courses_vw AS
SELECT id, name, price, content, description, teacher_id, active, created_at, updated_at 
FROM courses
WHERE 	id IS NOT NULL;

	
-- creating new table named 'new_courses',
-- which columns are in desired order from previously created view
SELECT * INTO new_courses FROM original_courses_vw;

-- re-altering table columns properties
ALTER TABLE new_courses
ALTER COLUMN id SET NOT NULL,
ALTER COLUMN name SET NOT NULL,
ALTER COLUMN teacher_id SET NOT NULL,
ALTER COLUMN content SET NOT NULL;



-- renaming original_table to 'old_courses'
ALTER TABLE courses RENAME TO old_courses;

-- dropping old 'courses' original_table, 
-- using CASCADE to prevent view's relationship
DROP TABLE old_courses CASCADE;

-- renaming to 'courses' table as original one
ALTER TABLE new_courses RENAME TO courses;

-- re-adding constraints for the recreated courses
ALTER TABLE courses ADD
	CONSTRAINT courses_id_primary PRIMARY KEY(id);
ALTER TABLE courses ADD
	CONSTRAINT courses_teacher_id_foreign FOREIGN KEY(teacher_id) REFERENCES teacher(id);

-- 
-- 
-- 

-- adding 3 new courses into the table
INSERT INTO courses (id, name, price, content, description, teacher_id, active)
VALUES  (1, 'Front-end 01', '1111', 'HTML-CSS-JS Basic', 'This is a basic front-end course', 1, 1),
		(2, 'Front-end 02', '1222', 'HTML-CSS-JS Intermediate', 'This is an intermediate front-end course', 1, 1),
		(3, 'Front-end 03', '1333', 'HTML-CSS-JS Advanced', 'This is an advanced front-end course', 1, 1),
		(4, 'Back-end 01', '2222', 'Nodejs Basic', 'This is a basic front-end course', 2, 1),
		(5, 'Back-end 02', '2333', 'Nodejs Intermediate', 'This is an intermediate back-end course', 2, 1),
		(6, 'Back-end 03', '2444', 'Nodejs Advanced', 'This isback-end course', 2, 1),
		(7, 'Fullstack 01', '3333', 'Fullstack Basic', 'This is a basic fullstack course', 3, 1),
		(8, 'Fullstack 02', '3444', 'Fullstack Intermediate', 'This is an intermediate fullstack course', 3, 1),
		(9, 'Fullstack 03', '3555', 'Fullstack Advanced', 'This is an advanced fullstack course', 3, 1);

-- adding "UNIQUE constraint" for courses' name and price column
ALTER TABLE courses ADD
	CONSTRAINT courses_name_and_price_unique UNIQUE (name, price);

-- updating 'courses' table data
UPDATE courses
SET name='A Whole New Front-End 01', price='11111', updated_at=now()
WHERE id=1;

UPDATE courses
SET name='A Whole New Front-End 02', price='12222', updated_at=now()
WHERE id=2;

UPDATE courses
SET name='A Whole New Front-End 03', price='13333', updated_at=now()
WHERE id=3;

UPDATE courses
SET name='A Whole New Back-End 01', price='22222', updated_at=now()
WHERE id=4;

UPDATE courses
SET name='A Whole New Back-End 02', price='23333', updated_at=now()
WHERE id=5;

UPDATE courses
SET name='A Whole New Back-End 03', price='24444', updated_at=now()
WHERE id=6;

UPDATE courses
SET name='A Whole New Fullstack 01', price='33333', updated_at=now()
WHERE id=7;

UPDATE courses
SET name='A Whole New Fullstack 02', price='34444', updated_at=now()
WHERE id=8;

UPDATE courses
SET name='A Whole New Fullstack 03', price='35555', updated_at=now()
WHERE id=9;

-- adding 3 new teachers into the table
INSERT INTO teacher (id, name, bio)
VALUES (1, 'Teacher 01', 'Bio 01'),
		(2, 'Teacher 02', 'Bio 02'),
		(3, 'Teacher 03', 'Bio 03');
		
-- adding "UNIQUE constraint" for teacher's bio column
ALTER TABLE teacher ADD
	CONSTRAINT teacher_bio_unique UNIQUE (bio);

-- updating 'teacher' table data
UPDATE teacher
SET bio='A Whole New Bio 01'
WHERE id=1;

UPDATE teacher
SET bio='A Whole New Bio 02'
WHERE id=2;

UPDATE teacher
SET bio='A Whole New Bio 03'
WHERE id=3;

-- Displaying Tables
SELECT * FROM teacher;
SELECT * FROM courses;