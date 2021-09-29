const mysql = require('mysql2/promise');
const fs = require('fs');

let step = 0

// Read customers
let rawdataEmployee = fs.readFileSync('Employees.json');
employeeData = rawdataEmployee.slice(0, -3) + ']}'
resultsEmp = JSON.parse(employeeData)
fs.writeFileSync('Employee2.json', employeeData);
console.log('Number of Employees: ', resultsEmp.data.length);
console.log(resultsEmp.data[0].items[0]);

try {
  addEmployees(resultsEmp)
} catch (e) {
  console.log('caught exception!', e);
}

async function addEmployees(resultsEmp) {

  // First, connect to our Google MySQL server
  connection = await mysql.createConnection({
    connectionLimit: 10,
    host: 'localhost',
    port: '3307',
    user: 'root',
    password: 'password',
    database: 'eLead_development',
    debug: false
  });
  console.log('connected!');
  const [rows, fields] = await connection.query('show databases');
  console.log(rows);

  connection.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL Server!');
  });

  try {
    // console.log('Line 39 - number of Positions = : ', resultsEmp.data[0].items.length, resultsEmp.data[0].items[0].id)
    for (position = 0; position < resultsEmp.data.length; position++) {
      for (step = 0; step < resultsEmp.data[position].items.length; step++) {
        // console.log('Line 39 - number of Employees = : ', resultsEmp.data.length, resultsEmp.data[0]);
        // console.log('Step = ', step);

        let insertQuery = 'INSERT IGNORE INTO ?? (??,??,??,??,??) VALUES (?,?,?,?,?)';
        let query = mysql.format(insertQuery, ["Employees", "id", "firstName", "lastName", "isActive", "isOff", resultsEmp.data[position].items[step].id, resultsEmp.data[position].items[step].firstName, resultsEmp.data[position].items[step].lastName, resultsEmp.data[position].items[step].isActive, resultsEmp.data[position].items[step].isOff]);

        await connection.query(query)

      }
    }
  } catch (e) {
    console.log('caught exception!', e);
  }
  connection.end((err) => {
    // The connection is terminated gracefully
    // Ensures all remaining queries are executed
    // Then sends a quit packet to the MySQL server.
  });
}
