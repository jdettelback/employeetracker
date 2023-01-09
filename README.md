# Employee Tracker

## Description
This is a command line tool that allows the user to view and change databases with information about their employees. Employees, roles and departments can be added and deleted.

## Table of Contents
* [Installation](#installation)
* [Usage](#usage)
* [Contact](#contact)

## Installation
This tool uses command line prompts to view a company HR database.  It requires node and the inquirer package to run. Inquirer verson 8.2.4 is recommended.  It also uses console.table to view the tables in the database which is implemented using mysql.

1. npm init -y
2. npm install inquirer@8.2.4 mysql2 console.table
3. node index

## Usage
Start the program by typing "npm start" into the terminal.  Then use the arrow keys to move through the choices and enter to select an option.  Answer the prompts as directed where appropriate.  

The database contains 3 tables, one for department, role and employeee.  

The department table contains a column with a name for the department and an id number.  

The role table has a column for the id number, title, and salary.  The role table references back to the department table through the department id number.

The employee table has a column for id number, first name, last name and manager. The employee table also references the id number in the role table and refers to the manager column within itself.

## Contact
Contact me at [jdettelback@gmail.com](mailto:jdettelback@gmail.com) if you have any questions.  You can see more of my work at <https://github.com/jdettelback>.


  ![screenshot](https://raw.githubusercontent.com/jdettelback/teamprofile/main/images/teamprofilescreenshot.png)
  
  ![screenshot](https://raw.githubusercontent.com/jdettelback/teamprofile/main/images/teamprofilescreenshot2.png)

