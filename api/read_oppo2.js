const mysql = require('mysql2/promise');
const fs = require('fs');

let step = 0

// Read opportunities
let rawdata = fs.readFileSync('Oppo2.json');
let results = JSON.parse(rawdata)
if (results[0].pageSize < results[0].totalItems) {
  num_of_items = results[0].pageSize
}
else {
  num_of_items = results[0].totalItems;
}
console.log(num_of_items);
console.log(results[0].totalItems);
console.log(results[0].links[2].href);

// console.log('Item 6 length = ', results[5].items.length);

let records = [];
let totalPages = results[0].totalPages;

for (let step = 0; step < totalPages; step++) {
  for (let index = 0; index < results[step].items.length; index++) {
    records = records.concat(results[step].items[index]);
  }
  fs.writeFileSync('Opp2.json', JSON.stringify(records));
}

console.log('Number of records before removing duplicates = ', records.length);