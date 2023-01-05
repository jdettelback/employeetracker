INSERT INTO department (name)
VALUES ("Purchasing"),
("Finance"),
("Operations"),
('Legal');

INSERT INTO role (title, salary, department_id)
VALUES ("engineer", "100000", 3),
("lawyer", "120000", 4),
("CFO", "200000", 2),
("engineering manager", "140000", 3);

INSERT INTO	employee (first_name, last_name, role_id, manager_id)
VALUES ('Jean', 'Lim', 2, null),
('Sean', 'Peters', 3, 3),
('Mia', 'Shaw', 1, null),
('Joe', 'Woo', 4, 2);
