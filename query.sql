SELECT *
FROM department;

SELECT *
FROM role;

SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name, role.salary, e2.first_name, e2.last_name
FROM department
JOIN role ON department.id = role.department_id
JOIN employee ON role.id = employee.role_id
LEFT JOIN employee e2 ON e2.id = employee.manager_id;

