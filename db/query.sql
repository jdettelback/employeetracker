-- View all departments - show department names and ids
USE company_db;

SELECT *
FROM department;

-- View all roles - show job title, role id, department, salary
SELECT *
FROM role;

-- View all Employees
SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name, role.salary, e2.first_name AS manager_first, e2.last_name AS manager_last
FROM department
JOIN role ON department.id = role.department_id
JOIN employee ON role.id = employee.role_id
LEFT JOIN employee e2 ON e2.id = employee.manager_id;

-- Add a department - enter name of department => added to db
INSERT INTO department (name)
    VALUES (?);

-- Add a role - enter name, salary and departmnet => added to db
INSERT INTO role (title, salary, department_id)
      VALUES (?,?,?);
-- Add an employee - enter first name, last name, role, manager => added to db
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?);
-- update an employee - select employee to update, new role => updated in db


