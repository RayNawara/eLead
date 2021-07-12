const mysql = require('mysql2/promise');
const fs = require('fs');

let step = 0

// Read customers
let rawdataActivities = fs.readFileSync('Activities.json');
ActivitiesData = rawdataActivities.slice(0, -3) + ']}'
resultsActivity = JSON.parse(ActivitiesData)
fs.writeFileSync('Activities2.json', ActivitiesData);
console.log(resultsActivity.data.length);

try {
  addActivities(resultsActivity)
} catch (e) {
  console.log('caught exception!', e);
}

async function addActivities(resultsActivity) {

  // First, connect to our Google MySQL server
  try {
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
  } catch (e) {
    console.log('Line 36 - caught exception!', e);
  }

  try {
    for (step = 0; step < resultsActivity.data.length - 1; step++) {
      // console.log(resultsActivity.data[step].items[0]);
      for (let index = 0; index < resultsActivity.data[step].items.length; index++) {
        console.log('Step = ', step, 'Index = ', index);
        let insertQuery = 'INSERT INTO ?? (??,??,??,??,??,??,??,??,??,??,??,??,??,??,??,??,??) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
        let query = mysql.format(insertQuery, ["Activities", "activityType", "category", "name", "completedDate", "dueDate", "closedDate", "outcome", "createdBy", "assignedTo", "completedBy", "opportunityId", "upType", "source", "subSource", "createdByUserId", "assignedToUserId", "completedByUserId", resultsActivity.data[step].items[index].activityType, resultsActivity.data[step].items[index].category, resultsActivity.data[step].items[index].name, resultsActivity.data[step].items[index].completedDate, resultsActivity.data[step].items[index].dueDate, resultsActivity.data[step].items[index].closedDate, resultsActivity.data[step].items[index].outcome, resultsActivity.data[step].items[index].createdBy, resultsActivity.data[step].items[index].assignedTo, resultsActivity.data[step].items[index].completedBy, resultsActivity.data[step].items[index].opportunityId, resultsActivity.data[step].items[index].upType, resultsActivity.data[step].items[index].source, resultsActivity.data[step].items[index].subSource, resultsActivity.data[step].items[index].createdByUserId, resultsActivity.data[step].items[index].assignedToUserId, resultsActivity.data[step].items[index].completedByUserId]);

        await connection.query(query)
      }
    }
  } catch (e) {
    console.log('Line 49 - caught exception!', e);
  }
  connection.end((err) => {
    // The connection is terminated gracefully
    // Ensures all remaining queries are executed
    // Then sends a quit packet to the MySQL server.
  });
}
