
USE company_db;

-- View department table
SELECT *
FROM department;

-- View role table
SELECT *
FROM role;

-- View employee information from employee table and role table
SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name, role.salary, e2.first_name AS manager_first, e2.last_name AS manager_last
FROM department
JOIN role ON department.id = role.department_id
JOIN employee ON role.id = employee.role_id
LEFT JOIN employee e2 ON e2.id = employee.manager_id;

-- Add a department
INSERT INTO department (name)
    VALUES (?);

-- Add a role
INSERT INTO role (title, salary, department_id)
      VALUES (?,?,?);

-- Add an employee
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?);

-- update an employee 
UPDATE employee SET role_id = ? WHERE employee.id = ?;

-- remove department
DELETE FROM department WHERE id = (?);

-- remove role
DELETE FROM role WHERE id = (?);

-- remove employee
DELETE FROM employee WHERE id = (?);

