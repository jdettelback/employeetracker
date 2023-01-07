const inquirer = require("inquirer");
const mysql = require("mysql2");
// const db = require("./db");
// const table = require("console.table");
const connection = require("./db/connection");

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
  const sql = `SELECT * FROM role`;

  db.query(sql, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    console.log(rows);
    console.log("\n");
    console.table(rows);
  });
}

function viewEmployees() {
  const sql = `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name, role.salary, e2.first_name, e2.last_name
FROM department
JOIN role ON department.id = role.department_id
JOIN employee ON role.id = employee.role_id
LEFT JOIN employee e2 ON e2.id = employee.manager_id`;

  db.query(sql, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    console.log(rows);
    console.log("\n");
    console.table(rows);
  });
}

function addDepartment() {
  const addDept = [
    { type: "input", message: "Name of Department to Add", name: "name" },
  ];
  inquirer.prompt(addDept).then((resp) => {
    console.log(resp);
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
    console.log(depts);

    const addRole = [
      {
        type: "input",
        message: "Name of Role to Add",
        name: "role",
      },
      {
        type: "input",
        message: "What is the salary, using numbers only",
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
      console.log(resp);
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
    console.log(resp);
    const sql = `INSERT INTO employee (first_name, last_name)
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

function init() {
  inquirer.prompt(firstOption).then((response) => {
    console.log(response);

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
        const message = "Update Role";
        console.log(message);
        break;
      }

      case "All Done": {
        return;
      }

      default: {
        console.log("No action received.");
      }
    }
  });
}

init();
