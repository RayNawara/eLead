const mysql = require('mysql2/promise');
const fs = require('fs');

let step = 0

// Read opportunities
let rawdata = fs.readFileSync('Oppo2.json');
let results = JSON.parse(rawdata)

let num_of_items = results.length;

console.log(num_of_items);
console.log(results[0]);

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
      let query = mysql.format(insertQuery, ["Opportunities", "id", "customer_id", "dateIn", "source", "subSource", "status", "subStatus", "uptype", results[step].id, results[step].customer.id, results[step].dateIn, results[step].source, results[step].subSource, results[step].status, results[step].subStatus, results[step].upType]);
      await connection.query(query)

      // Insert SalesTeam

      if ('salesTeam' in results[step]) {
        for (let index = 0; index < results[step].salesTeam.length; index++) {
          let insertQuery = 'INSERT INTO ?? (??,??,??,??,??,??,??) VALUES (?,?,?,?,?,?,?) ON DUPLICATE KEY UPDATE id=id';
          let query = mysql.format(insertQuery, ["SalesTeams", "id", "firstName", "lastName", "isPrimary", "isPositionPrimary", "positionName", "positionCode", results[step].salesTeam[index].id, results[step].salesTeam[index].firstName, results[step].salesTeam[index].lastName, results[step].salesTeam[index].isPrimary, results[step].salesTeam[index].isPositionPrimary, results[step].salesTeam[index].positionName, results[step].salesTeam[index].positionCode]);
          await connection.query(query)

          let insertQuery2 = 'INSERT INTO ?? (??,??) VALUES (?,?) ON DUPLICATE KEY UPDATE opportunityId=opportunityId';
          let query2 = mysql.format(insertQuery2, ["Opportunity_SalesTeams", "opportunityId", "salesTeamsId", results[step].id, results[step].salesTeam[index].id]);
          await connection.query(query2)
        }
      }

      // Insert Sought Vehicles if they exist
      if ('soughtVehicles' in results[step]) {
        for (let index = 0; index < results[step].soughtVehicles.length; index++) {
          let insertQuery = 'INSERT INTO ?? (??,??,??,??,??,??,??,??,??,??,??,??,??) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)';
          let query = mysql.format(insertQuery, ["SoughtVehicles", "id", "isNew", "yearFrom", "yearTo", "make", "model", "carTrim", "vin", "priceFrom", "priceTo", "maxMileage", "stockNumber", "isPrimary", results[step].soughtVehicles[index].id, results[step].soughtVehicles[index].isNew, results[step].soughtVehicles[index].yearFrom, results[step].soughtVehicles[index].yearTo, results[step].soughtVehicles[index].make, results[step].soughtVehicles[index].model, results[step].soughtVehicles[index].carTrim, results[step].soughtVehicles[index].vin, results[step].soughtVehicles[index].priceFrom, results[step].soughtVehicles[index].priceTo, results[step].soughtVehicles[index].maxMileage, results[step].soughtVehicles[index].stockNumber, results[step].soughtVehicles[index].isPrimary]);

          await connection.query(query)

          let insertQuery2 = 'INSERT INTO ?? (??,??) VALUES (?,?)';
          let query2 = mysql.format(insertQuery2, [`Opportunity_SoughtVehicles`, "opportunityId", "soughtVehicleId", results[step].id, results[step].soughtVehicles[index].id]);

          await connection.query(query2)
        }
      }

      // Insert TradeIns if they exist
      if ('tradeIns' in results[step]) {
        for (let index = 0; index < results[step].tradeIns.length; index++) {
          let insertQuery = 'INSERT INTO ?? (??,??,??,??,??,??,??,??,??) VALUES (?,?,?,?,?,?,?,?,?)';
          let query = mysql.format(insertQuery, ["TradeIns", "id", "carYear", "make", "model", "carTrim", "vin", "estimatedMileage", "interiorColor", "exteriorColor", results[step].tradeIns[index].id, results[step].tradeIns[index].carYear, results[step].tradeIns[index].make, results[step].tradeIns[index].model, results[step].tradeIns[index].carTrim, results[step].tradeIns[index].vin, results[step].tradeIns[index].estimatedMileage, results[step].tradeIns[index].interiorColor, results[step].tradeIns[index].exteriorColor]);

          await connection.query(query)

          let insertQuery2 = 'INSERT INTO ?? (??,??) VALUES (?,?) ON DUPLICATE KEY UPDATE opportunityId=opportunityId';
          let query2 = mysql.format(insertQuery2, [`Opportunity_TradeIns`, "opportunityId", "tradeInId", results[step].id, results[step].tradeIns[index].id]);

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

module.exports = addOpportunities