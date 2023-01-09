const inquirer = require("inquirer");
const mysql = require("mysql2");
const table = require("console.table");

const db = mysql.createConnection(
  {
    host: "127.0.0.1",
    user: "root",
    password: "",
    database: "company_db",
  },
  console.log(`Connected to the company_db database.`)
);

const firstOption = [
  {
    type: "list",
    message: "Select an option.",
    name: "options",
    choices: [
      "View All Departments",
      "View All Roles",
      "View All Employees",
      "Add a Department",
      "Add a Role",
      "Add an Employee",
      "Update an Employee's Role",
      "Remove a Department",
      "Remove a Role",
      "Remove an Employee",
      "All Done",
    ],
  },
];

function getDepartments() {
  return new Promise(function (success, failure) {
    const sql = `SELECT * FROM department`;

    db.query(sql, (err, rows) => {
      if (err) {
        failure(err.message);
      }
      success(rows);
    });
  });
}

function getRoles() {
  return new Promise(function (success, failure) {
    const sql = `SELECT * FROM role`;

    db.query(sql, (err, rows) => {
      if (err) {
        failure(err.message);
      }
      success(rows);
    });
  });
}

function getManagers() {
  return new Promise(function (success, failure) {
    const sql = `SELECT first_name, last_name, id FROM employee WHERE manager_id is null`;

    db.query(sql, (err, rows) => {
      if (err) {
        failure(err.message);
      }
      success(rows);
    });
  });
}

function getEmployees() {
  return new Promise(function (success, failure) {
    const sql = `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name, role.salary, e2.first_name AS manager_first, e2.last_name AS manager_last
FROM department
JOIN role ON department.id = role.department_id
JOIN employee ON role.id = employee.role_id
LEFT JOIN employee e2 ON e2.id = employee.manager_id`;

    db.query(sql, (err, rows) => {
      if (err) {
        failure(err.message);
      }
      success(rows);
    });
  });
}

function viewDepartments() {
  getDepartments().then(
    (rows) => {
      console.log("\n");
      console.table(rows);
    },
    (message) => console.log(message)
  );
}

function viewRoles() {
  getRoles().then(
    (rows) => {
      console.log('\n');
      console.table(rows);
    },
    (message) => console.log(message)
  );
}

function viewEmployees() {
  getEmployees().then(
    (rows) => {
      console.log("\n");
      console.table(rows);
    },
    (message) => console.log(message)
  );
}

function addDepartment() {
  const addDept = [
    { type: "input", 
    message: "Name of Department to Add", 
    name: "name" },
  ];
  inquirer.prompt(addDept).then((resp) => {
     const sql = `INSERT INTO department (name)
    VALUES (?)`;
    const params = [resp.name];

    db.query(sql, params, (err, result) => {
      if (err) {
        console.log(err.message);
        return;
      }
      console.log("Dept created");
      init();
    });
  });
}

function addRole() {
  depts = [];
  getDepartments().then((rows) => {
    rows.map((d) => {
      depts.push({
        name: d.name,
        value: d.id,
      });
    });
  
    const addRole = [
      {
        type: "input",
        message: "Name of Role to Add",
        name: "role",
      },
      {
        type: "input",
        message: "What is the salary for this role, using numbers only",
        name: "salary",
      },
      {
        type: "list",
        message: "What Department does this Role belong to?",
        name: "options",
        choices: depts,
      },
    ];
    inquirer.prompt(addRole).then((resp) => {
       const sql = `INSERT INTO role (title, salary, department_id)
      VALUES (?,?,?)`;
      const params = [resp.role, resp.salary, resp.options];

      db.query(sql, params, (err, result) => {
        if (err) {
          console.log(err.message);
          return;
        }
        console.log("Role created");
        init();
      });
    });
  });
}

function addEmployee() {
  var fName, lName;
  var roleid;
  var manid;
  const addEmpl = [
    {
      type: "input",
      message: "First Name of New Employee",
      name: "firstName",
    },
    {
      type: "input",
      message: "Last Name of New Employee",
      name: "lastName",
    },
  ];
  inquirer.prompt(addEmpl).then((resp) => {
    fName = resp.firstName;
    lName = resp.lastName;

    roles = [];
    getRoles().then((rows) => {
      rows.map((d) => {
        roles.push({
          name: d.title,
          value: d.id,
        });
      });

      const addR = [
        {
          type: "list",
          message: "Which role is this employee being placed in?",
          name: "options",
          choices: roles,
        },
      ];

      inquirer.prompt(addR).then((resp) => {
        roleid = resp.options;

        managers = [];
        getManagers().then((rows) => {
          rows.map((d) => {
            managers.push({
              name: d.first_name + " " + d.last_name,
              value: d.id,
            });
          });
          
          const addM = [
            {
              type: "list",
              message: "Which Manager is supervising this new employee?",
              name: "options",
              choices: managers,
            },
          ];

          inquirer.prompt(addM).then((resp) => {
            manid = resp.options;

            const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)`;
            const params = [fName, lName, roleid, manid];

            db.query(sql, params, (err, result) => {
              if (err) {
                console.log(err.message);
                return;
              }
              console.log("Employee created");
              init();
            });
          });
        });
      });
    });
  });
}

function updateRole() {
  var employId;
  var newRole;

  employees = [];
  getEmployees().then((rows) => {
    rows.map((d) => {
      employees.push({
        name: d.first_name + " " + d.last_name,
        value: d.id,
      });
    });

    const chooseEmpl = [
      {
        type: "list",
        message: "Which employee is being updated?",
        name: "options",
        choices: employees,
      },
    ];

    inquirer.prompt(chooseEmpl).then((resp) => {
      employId = resp.options;

      roles = [];
      getRoles().then((rows) => {
        rows.map((d) => {
          roles.push({
            name: d.title,
            value: d.id,
          });
        });

        const addR = [
          {
            type: "list",
            message: "Which role is this employee being placed in?",
            name: "options",
            choices: roles,
          },
        ];

        inquirer.prompt(addR).then((resp) => {
          newRole = resp.options;

          const sql = `UPDATE employee SET role_id = ? WHERE employee.id = ?`;
          const params = [newRole, employId];

          db.query(sql, params, (err, result) => {
            if (err) {
              console.log(err.message);
              return;
            }
            console.log("Employee updated");
            init();
          });
        });
      });
    });
  });
}

function removeDepartment() {
  depts = [];
  getDepartments().then((rows) => {
    rows.map((d) => {
      depts.push({
        name: d.name,
        value: d.id,
      });
    });

    const remDept = [
      {
        type: "list",
        message: "Name of Department to Remove",
        name: "name",
        choices: depts,
      },
    ];

    inquirer.prompt(remDept).then((resp) => {
      const sql = `DELETE FROM department WHERE id = (?)`;
      const params = [resp.name];

      db.query(sql, params, (err, result) => {
        if (err) {
          console.log(err.message);
          return;
        }
        console.log("Department removed");
        init();
      });
    });
  });
}

function removeRole() {
  roles = [];
  getRoles().then((rows) => {
    rows.map((d) => {
      roles.push({
        name: d.title,
        value: d.id,
      });
    });

    const remRole = [
      {
        type: "list",
        message: "What Role are you removing?",
        name: "role",
        choices: roles,
      },
    ];

    inquirer.prompt(remRole).then((resp) => {
      const sql = `DELETE FROM role WHERE id = (?)`;
      const params = [resp.role];

      db.query(sql, params, (err, result) => {
        if (err) {
          console.log(err.message);
          return;
        }
        console.log("Role Removed");
        init();
      });
    });
  });
}

function removeEmployee() {
  employee = [];
  getEmployees().then((rows) => {
    rows.map((d) => {
      employee.push({
        name: d.first_name + " " + d.last_name,
        value: d.id,
      });
    });

    const remEmployee = [
      {
        type: "list",
        message: "Name of employee to remove",
        name: "name",
        choices: employee,
      },
    ];

    inquirer.prompt(remEmployee).then((resp) => {
      const sql = `DELETE FROM employee WHERE id = (?)`;
      const params = [resp.name];

      db.query(sql, params, (err, result) => {
        if (err) {
          console.log(err.message);
          return;
        }
        console.log("Employee removed");
        init();
      });
    });
  });
}

function init() {
  inquirer.prompt(firstOption).then((response) => {

    switch (response.options) {
      case "View All Departments": {
        viewDepartments();
        init();
        break;
      }

      case "View All Roles": {
        viewRoles();
        init();
        break;
      }

      case "View All Employees": {
        viewEmployees();
        init();
        break;
      }

      case "Add a Department": {
        addDepartment();
        break;
      }

      case "Add a Role": {
        addRole();
        break;
      }

      case "Add an Employee": {
        addEmployee();
        break;
      }

      case "Update an Employee's Role": {
        updateRole();
        break;
      }

      case "Remove a Department": {
        removeDepartment();
        break;
      }

      case "Remove a Role": {
        removeRole();
         break;
      }

      case "Remove an Employee": {
        removeEmployee();
        break;
      }

      case "All Done": {
        console.log('Have a nice day!');
        process.exit();
      }

      default: {
        console.log("No action received.");
      }
    }
  });
}

init();
