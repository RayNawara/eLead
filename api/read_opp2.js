const mysql = require('mysql2/promise');
const fs = require('fs');

let step = 0

// Read opportunities
let rawdata = fs.readFileSync('Opp2.json');
let results = JSON.parse(rawdata)

console.log(results[0]);
console.log(results[0].id);
console.log(results[0].customer.id);

console.log('Item 6 length = ', results.length);

// let records = [];
// let totalPages = results[0].totalPages;

// for (let step = 0; step < totalPages; step++) {
//   for (let index = 0; index < results[step].items.length; index++) {
//     records = records.concat(results[step].items[index]);
//   }
//   fs.writeFileSync('Opp2.json', JSON.stringify(records));
// }

// console.log('Number of records before removing duplicates = ', records.length);