-- View all departments - show department names and ids
USE company_db;

SELECT *
FROM department;

-- View all roles - show job title, role id, department, salary
SELECT *
FROM role;

-- View all Employees
SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name, role.salary, e2.first_name, e2.last_name
FROM department
JOIN role ON department.id = role.department_id
JOIN employee ON role.id = employee.role_id
LEFT JOIN employee e2 ON e2.id = employee.manager_id;

-- Add a department - enter name of department => added to db

-- Add a role - enter name, salary and departmnet => added to db

-- Add an employee - enter first name, last name, role, manager => added to db

-- update an employee - select employee to update, new role => updated in db


