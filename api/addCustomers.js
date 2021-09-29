const mysql = require('mysql2/promise');
const fs = require('fs');

let step = 0

// Read customers
let rawdataCustomer = fs.readFileSync('CustsA.json');
customerData = rawdataCustomer.slice(0, -3) + ']}'
resultsCust = JSON.parse(customerData)
fs.writeFileSync('Customer2.json', customerData);
console.log('Line 11 - Total Customers = ', resultsCust.items.length);

try {
  addCustomers(resultsCust)
} catch (e) {
  console.log('caught exception!', e);
}

async function addCustomers(resultsCust) {

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
    for (step = 0; step < resultsCust.items.length - 1; step++) {
      // console.log('Line 39 - number of Customers = : ', resultsCust.items.length, resultsCust.items[0]);
      // console.log('Step = ', step);
      if ('address' in resultsCust.items[step]) {
        let insertQuery = 'INSERT IGNORE INTO ?? (??,??,??,??,??,??,??,??,??,??,??,??,??,??,??,??,??) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
        let query = mysql.format(insertQuery, ["Customers", "id", "isBusiness", "title", "firstName", "middleName", "lastName", "nickname", "birthday", "addressLine1", "addressLine2", "city", "state", "zip", "country", "county", "doNotMail", "isPreferred", resultsCust.items[step].id, resultsCust.items[step].isBusiness, resultsCust.items[step].title, resultsCust.items[step].firstName, resultsCust.items[step].middleName, resultsCust.items[step].lastName, resultsCust.items[step].nickname, resultsCust.items[step].birthday, resultsCust.items[step].address.addressLine1, resultsCust.items[step].address.addressLine2, resultsCust.items[step].address.city, resultsCust.items[step].address.state, resultsCust.items[step].address.zip, resultsCust.items[step].address.country, resultsCust.items[step].address.county, resultsCust.items[step].doNotMail, resultsCust.items[step].isPreferred]);

        await connection.query(query)

      } else {
        let insertQuery = 'INSERT IGNORE INTO ?? (??,??,??,??,??,??,??,??,??,??) VALUES (?,?,?,?,?,?,?,?,?,?)';
        let query = mysql.format(insertQuery, ["Customers", "id", "isBusiness", "title", "firstName", "middleName", "lastName", "nickname", "birthday", "doNotMail", "isPreferred", resultsCust.items[step].id, resultsCust.items[step].isBusiness, resultsCust.items[step].title, resultsCust.items[step].firstName, resultsCust.items[step].middleName, resultsCust.items[step].lastName, resultsCust.items[step].nickname, resultsCust.items[step].birthday, resultsCust.items[step].doNotMail, resultsCust.items[step].isPreferred]);

        await connection.query(query)

      }

      if ('emails' in resultsCust.items[step]) {
        for (let index = 0; index < resultsCust.items[step].emails.length; index++) {
          let insertQuery = 'INSERT INTO ?? (??,??,??,??,??) VALUES (?,?,?,?,?)';
          let query = mysql.format(insertQuery, ["Emails", "customer_id", "address", "emailType", "doNotEmail", "isPreferred", resultsCust.items[step].id, resultsCust.items[step].emails[index].address, resultsCust.items[step].emails[index].emailType, resultsCust.items[step].emails[index].doNotEmail, resultsCust.items[step].emails[index].isPreferred]);
          await connection.query(query)
        }
      }

      if ('phones' in resultsCust.items[step]) {
        for (let index = 0; index < resultsCust.items[step].phones.length; index++) {
          let insertQuery = 'INSERT INTO ?? (??,??,??,??) VALUES (?,?,?,?)';
          let query = mysql.format(insertQuery, ["Phones", "customer_id", "number", "phoneType", "preferredTimeToContact", resultsCust.items[step].id, resultsCust.items[step].phones[index].number, resultsCust.items[step].phones[index].phoneType, resultsCust.items[step].phones[index].preferredTimeToContact]);
          await connection.query(query)
        }
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
