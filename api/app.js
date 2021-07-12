const mysql = require('mysql2/promise');
const fs = require('fs');

// First, connect to our Google MySQL server
const connection = await mysql.createConnection({
  host: 'localhost',
  port: '3307',
  user: 'root',
  password: 'password',
  database: 'eLead_development',
  debug: false
});

connection.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL Server!');
});

// Read opportunities
let rawdata = fs.readFileSync('Opportunities.json');
let results = JSON.parse(rawdata)
if (results.pageSize < results.totalItems) {
  num_of_items = results.pageSize
}
else {
  num_of_items = results.totalItems;
}
console.log(num_of_items);
console.log(results.items[0]);

// Read customers
let rawdataCustomer = fs.readFileSync('Customers.json');
customerData = rawdataCustomer.slice(0, -3) + ']}'
resultsCust = JSON.parse(customerData)
fs.writeFileSync('Customer2.json', customerData);
console.log(resultsCust);

let step = 0

// timeout just to avoid firing query before connection happens

setTimeout(() => {
  for (step = 0; step < num_of_items - 1; step++) {
    console.log('Line 48 Step = ', step);
    // console.log(results.items[step]);
    // Wait to insert opportunities
    setTimeout(() => {
      addOpportunity(results)
    }, 10000)
    // First insert customers    
    addCustomers(resultsCust)
  }

  connection.end((err) => {
    // The connection is terminated gracefully
    // Ensures all remaining queries are executed
    // Then sends a quit packet to the MySQL server.
  });
}, 5000)


// add rows in the table

function addSoughtVehicles(results) {
  for (let index = 0; index < results.items[step].soughtVehicles.length; index++) {
    let insertQuery = 'INSERT INTO ?? (??,??,??,??,??,??,??,??,??,??,??,??,??) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)';
    let query = mysql.format(insertQuery, ["SoughtVehicles", "id", "isNew", "yearFrom", "yearTo", "make", "model", "carTrim", "vin", "priceFrom", "priceTo", "maxMileage", "stockNumber", "isPrimary", results.items[step].soughtVehicles[index].id, results.items[step].soughtVehicles[index].isNew, results.items[step].soughtVehicles[index].yearFrom, results.items[step].soughtVehicles[index].yearTo, results.items[step].soughtVehicles[index].make, results.items[step].soughtVehicles[index].model, results.items[step].soughtVehicles[index].carTrim, results.items[step].soughtVehicles[index].vin, results.items[step].soughtVehicles[index].priceFrom, results.items[step].soughtVehicles[index].priceTo, results.items[step].soughtVehicles[index].maxMileage, results.items[step].soughtVehicles[index].stockNumber, results.items[step].soughtVehicles[index].isPrimary]);
    connection.query(query, (err, response) => {
      if (err) {
        console.error(err);
        return;
      }
      // rows added
    })
    let insertQuery2 = 'INSERT INTO ?? (??,??) VALUES (?,?)';
    let query2 = mysql.format(insertQuery2, [`Opportunity_SoughtVehicles`, "opportunityId", "soughtVehicleId", results.items[step].id, results.items[step].soughtVehicles[index].id]);
    connection.query(query2, (err, response) => {
      if (err) {
        console.error(err);
        return;
      }
      // rows added
    })
  }
}

function addTradeIns(results) {
  // console.log('***** Query 3 *****');
  for (let index = 0; index < results.items[step].tradeIns.length; index++) {
    let insertQuery = 'INSERT INTO ?? (??,??,??,??,??,??,??,??,??) VALUES (?,?,?,?,?,?,?,?,?)';
    let query = mysql.format(insertQuery, ["TradeIns", "id", "carYear", "make", "model", "carTrim", "vin", "estimatedMileage", "interiorColor", "exteriorColor", results.items[step].tradeIns[index].id, results.items[step].tradeIns[index].carYear, results.items[step].tradeIns[index].make, results.items[step].tradeIns[index].model, results.items[step].tradeIns[index].carTrim, results.items[step].tradeIns[index].vin, results.items[step].tradeIns[index].estimatedMileage, results.items[step].tradeIns[index].interiorColor, results.items[step].tradeIns[index].exteriorColor]);
    connection.query(query, (err, response) => {
      if (err) {
        console.error(err);
        return;
      }
      // rows added
      // console.log(response.insertId);
    })

    // console.log('***** Query 4 *****');
    let insertQuery2 = 'INSERT INTO ?? (??,??) VALUES (?,?) ON DUPLICATE KEY UPDATE opportunityId=opportunityId';
    // console.log('Line 103 - ', results.items[step].id, results.items[step].tradeIns[index].id);
    let query2 = mysql.format(insertQuery2, [`Opportunity_TradeIns`, "opportunityId", "tradeInId", results.items[step].id, results.items[step].tradeIns[index].id]);
    // console.log('In Query 4 - Index = ', index);
    connection.query(query2, (err, response) => {
      if (err) {
        console.error(err);
        console.log('Step = ', step, 'Index = ', index);
        console.log(results.items[step].id, results.items[step].tradeIns[index].id, results.items[step].tradeIns[index].model);
        // throw 'Error in creating Opportunity_TradeIns'
        console.error(err);
        return;
      }
      // rows added
      // console.log(response.insertId);
    })
  }
}

function addSalesTeam(results) {
  for (let index = 0; index < results.items[step].salesTeam.length; index++) {
    // console.log('***** Query 1 *****');
    // console.log('Index = ', index);
    let insertQuery = 'INSERT INTO ?? (??,??,??,??,??,??,??) VALUES (?,?,?,?,?,?,?) ON DUPLICATE KEY UPDATE id=id';
    let query = mysql.format(insertQuery, ["SalesTeams", "id", "firstName", "lastName", "isPrimary", "isPositionPrimary", "positionName", "positionCode", results.items[step].salesTeam[index].id, results.items[step].salesTeam[index].firstName, results.items[step].salesTeam[index].lastName, results.items[step].salesTeam[index].isPrimary, results.items[step].salesTeam[index].isPositionPrimary, results.items[step].salesTeam[index].positionName, results.items[step].salesTeam[index].positionCode]);
    connection.query(query, (err, response) => {
      if (err) {
        console.error(err);
        console.log('Step = ', step);
        console.log(results.items[step].salesTeam[index].id, results.items[step].id, results.items[step].salesTeam[index].firstName);
        // throw 'Parameter is not a number!'
        return;
      }
      // rows added
      // console.log(response.insertId);
    })

    // console.log('***** Query 2 *****');
    let insertQuery2 = 'INSERT INTO ?? (??,??) VALUES (?,?) ON DUPLICATE KEY UPDATE opportunityId=opportunityId';
    let query2 = mysql.format(insertQuery2, ["Opportunity_SalesTeams", "opportunityId", "salesTeamsId", results.items[step].id, results.items[step].salesTeam[index].id]);
    // console.log('In Query 2 - Index = ', index);
    connection.query(query2, (err, response) => {
      if (err) {
        console.error(err);
        console.log('Step = ', step, 'Index = ', index);
        console.log(results.items[step].id, results.items[step].salesTeam[index].id, results.items[step].salesTeam[0].firstName);
        // throw 'Error in creating Opportunity_SalesTeams'
        console.error(err);
        return;
      }
      // rows added
      // console.log(response.insertId);
    })
  }
}

function addCustomers(resultsCust) {
  console.log('Line 159 - number of Customers = : ', resultsCust.items.length, resultsCust.items[0]);
  console.log('Step = ', step);
  if ('address' in resultsCust.items[step]) {
    let insertQuery = 'INSERT INTO ?? (??,??,??,??,??,??,??,??,??,??,??,??,??,??,??,??,??) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
    let query = mysql.format(insertQuery, ["Customers", "id", "isBusiness", "title", "firstName", "middleName", "lastName", "nickname", "birthday", "addressLine1", "addressLine2", "city", "state", "zip", "country", "county", "doNotMail", "isPreferred", resultsCust.items[step].id, resultsCust.items[step].isBusiness, resultsCust.items[step].title, resultsCust.items[step].firstName, resultsCust.items[step].middleName, resultsCust.items[step].lastName, resultsCust.items[step].nickname, resultsCust.items[step].birthday, resultsCust.items[step].address.addressLine1, resultsCust.items[step].address.addressLine2, resultsCust.items[step].address.city, resultsCust.items[step].address.state, resultsCust.items[step].address.zip, resultsCust.items[step].address.country, resultsCust.items[step].address.county, resultsCust.items[step].doNotMail, resultsCust.items[step].isPreferred]);

    connection.query(query, (err, response) => {
      if (err) {
        console.error(err);
        return;
      }
      // rows added
    })
  } else {
    let insertQuery = 'INSERT INTO ?? (??,??,??,??,??,??,??,??,??,??) VALUES (?,?,?,?,?,?,?,?,?,?)';
    let query = mysql.format(insertQuery, ["Customers", "id", "isBusiness", "title", "firstName", "middleName", "lastName", "nickname", "birthday", "doNotMail", "isPreferred", resultsCust.items[step].id, resultsCust.items[step].isBusiness, resultsCust.items[step].title, resultsCust.items[step].firstName, resultsCust.items[step].middleName, resultsCust.items[step].lastName, resultsCust.items[step].nickname, resultsCust.items[step].birthday, resultsCust.items[step].doNotMail, resultsCust.items[step].isPreferred]);

    connection.query(query, (err, response) => {
      if (err) {
        console.error(err);
        return;
      }
      // rows added
    })
  }

  if ('emails' in resultsCust.items[step]) {
    for (let index = 0; index < resultsCust.items[step].emails.length; index++) {
      let insertQuery = 'INSERT INTO ?? (??,??,??,??,??) VALUES (?,?,?,?,?)';
      let query = mysql.format(insertQuery, ["Emails", "customer_id", "address", "emailType", "doNotEmail", "isPreferred", resultsCust.items[step].id, resultsCust.items[step].emails[index].address, resultsCust.items[step].emails[index].emailType, resultsCust.items[step].emails[index].doNotEmail, resultsCust.items[step].emails[index].isPreferred]);
      connection.query(query, (err, response) => {
        if (err) {
          console.error(err);
          return;
        }
        // rows added
      })
    }
  }

  if ('phones' in resultsCust.items[step]) {
    for (let index = 0; index < resultsCust.items[step].phones.length; index++) {
      let insertQuery = 'INSERT INTO ?? (??,??,??,??) VALUES (?,?,?,?)';
      let query = mysql.format(insertQuery, ["Phones", "customer_id", "number", "phoneType", "preferredTimeToContact", resultsCust.items[step].id, resultsCust.items[step].phones[index].number, resultsCust.items[step].phones[index].phoneType, resultsCust.items[step].phones[index].preferredTimeToContact]);
      connection.query(query, (err, response) => {
        if (err) {
          console.error(err);
          return;
        }
        // rows added
      })
    }
  }
}

function addOpportunity(results) {
  let insertQuery = 'INSERT INTO ?? (??,??,??,??,??,??,??,??) VALUES (?,?,?,?,?,?,?,?)';
  let query = mysql.format(insertQuery, ["Opportunities", "id", "customer_id", "dateIn", "source", "subSource", "status", "subStatus", "uptype", results.items[step].id, results.items[step].customer.id, results.items[step].dateIn, results.items[step].source, results.items[step].subSource, results.items[step].status, results.items[step].subStatus, results.items[step].upType]);
  connection.query(query, (err, response) => {
    if (err) {
      console.error(err);
      return;
    }
    // rows added
    // console.log(response.insertId);
  })
  // Insert SalesTeam
  console.log('Sales Team Length = ', results.items[step].salesTeam.length);
  if ('salesTeam' in results.items[step]) {
    console.log('***** Now adding Sales Team *****');
    // console.log(results.items[salesStep].salesTeam[index]);
    // console.log(results.items[salesStep].salesTeam[index].id);
    addSalesTeam(results)
    // console.log('\n\n');
  }

  if ('soughtVehicles' in results.items[step]) {
    // console.log(step);
    // console.log(results.items[step].id);
    // console.log(results.items[step].soughtVehicles[0]);
    // console.log(results.items[step].soughtVehicles[0].id);
    addSoughtVehicles(results)
    // console.log('\n\n');
  }

  if ('tradeIns' in results.items[step]) {
    // console.log(step);
    // console.log(results.items[step].id);
    // console.log(results.items[step].tradeIns[0]);
    // console.log(results.items[step].tradeIns[0].id);
    addTradeIns(results)
    // console.log('\n\n');
  }

}