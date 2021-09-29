const mysql = require('mysql2/promise');
const fs = require('fs');

let step = 0

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

try {
  addOpportunities(results)
} catch (e) {
  console.log('caught exception!', e);
}

async function addOpportunities(results) {

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
    for (step = 0; step < num_of_items - 1; step++) {
      let insertQuery = 'INSERT INTO ?? (??,??,??,??,??,??,??,??) VALUES (?,?,?,?,?,?,?,?)';
      let query = mysql.format(insertQuery, ["Opportunities", "id", "customer_id", "dateIn", "source", "subSource", "status", "subStatus", "uptype", results.items[step].id, results.items[step].customer.id, results.items[step].dateIn, results.items[step].source, results.items[step].subSource, results.items[step].status, results.items[step].subStatus, results.items[step].upType]);
      await connection.query(query)

      // Insert SalesTeam

      if ('salesTeam' in results.items[step]) {
        for (let index = 0; index < results.items[step].salesTeam.length; index++) {
          let insertQuery = 'INSERT INTO ?? (??,??,??,??,??,??,??) VALUES (?,?,?,?,?,?,?) ON DUPLICATE KEY UPDATE id=id';
          let query = mysql.format(insertQuery, ["SalesTeams", "id", "firstName", "lastName", "isPrimary", "isPositionPrimary", "positionName", "positionCode", results.items[step].salesTeam[index].id, results.items[step].salesTeam[index].firstName, results.items[step].salesTeam[index].lastName, results.items[step].salesTeam[index].isPrimary, results.items[step].salesTeam[index].isPositionPrimary, results.items[step].salesTeam[index].positionName, results.items[step].salesTeam[index].positionCode]);
          await connection.query(query)

          let insertQuery2 = 'INSERT INTO ?? (??,??) VALUES (?,?) ON DUPLICATE KEY UPDATE opportunityId=opportunityId';
          let query2 = mysql.format(insertQuery2, ["Opportunity_SalesTeams", "opportunityId", "salesTeamsId", results.items[step].id, results.items[step].salesTeam[index].id]);
          await connection.query(query2)
        }
      }

      // Insert Sought Vehicles if they exist
      if ('soughtVehicles' in results.items[step]) {
        for (let index = 0; index < results.items[step].soughtVehicles.length; index++) {
          let insertQuery = 'INSERT INTO ?? (??,??,??,??,??,??,??,??,??,??,??,??,??) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)';
          let query = mysql.format(insertQuery, ["SoughtVehicles", "id", "isNew", "yearFrom", "yearTo", "make", "model", "carTrim", "vin", "priceFrom", "priceTo", "maxMileage", "stockNumber", "isPrimary", results.items[step].soughtVehicles[index].id, results.items[step].soughtVehicles[index].isNew, results.items[step].soughtVehicles[index].yearFrom, results.items[step].soughtVehicles[index].yearTo, results.items[step].soughtVehicles[index].make, results.items[step].soughtVehicles[index].model, results.items[step].soughtVehicles[index].carTrim, results.items[step].soughtVehicles[index].vin, results.items[step].soughtVehicles[index].priceFrom, results.items[step].soughtVehicles[index].priceTo, results.items[step].soughtVehicles[index].maxMileage, results.items[step].soughtVehicles[index].stockNumber, results.items[step].soughtVehicles[index].isPrimary]);

          await connection.query(query)

          let insertQuery2 = 'INSERT INTO ?? (??,??) VALUES (?,?)';
          let query2 = mysql.format(insertQuery2, [`Opportunity_SoughtVehicles`, "opportunityId", "soughtVehicleId", results.items[step].id, results.items[step].soughtVehicles[index].id]);

          await connection.query(query2)
        }
      }

      // Insert TradeIns if they exist
      if ('tradeIns' in results.items[step]) {
        for (let index = 0; index < results.items[step].tradeIns.length; index++) {
          let insertQuery = 'INSERT INTO ?? (??,??,??,??,??,??,??,??,??) VALUES (?,?,?,?,?,?,?,?,?)';
          let query = mysql.format(insertQuery, ["TradeIns", "id", "carYear", "make", "model", "carTrim", "vin", "estimatedMileage", "interiorColor", "exteriorColor", results.items[step].tradeIns[index].id, results.items[step].tradeIns[index].carYear, results.items[step].tradeIns[index].make, results.items[step].tradeIns[index].model, results.items[step].tradeIns[index].carTrim, results.items[step].tradeIns[index].vin, results.items[step].tradeIns[index].estimatedMileage, results.items[step].tradeIns[index].interiorColor, results.items[step].tradeIns[index].exteriorColor]);

          await connection.query(query)

          let insertQuery2 = 'INSERT INTO ?? (??,??) VALUES (?,?) ON DUPLICATE KEY UPDATE opportunityId=opportunityId';
          let query2 = mysql.format(insertQuery2, [`Opportunity_TradeIns`, "opportunityId", "tradeInId", results.items[step].id, results.items[step].tradeIns[index].id]);

          await connection.query(query2)
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