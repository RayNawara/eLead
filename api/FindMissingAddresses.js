const fs = require('fs');

let rawdata = fs.readFileSync('Customer2.json');
let results = JSON.parse(rawdata)

console.log('Number of items: ', results.items.length);

let count = 0

for (let index = 0; index < results.items.length; index++) {
  if (!results.items[index].hasOwnProperty('address')) {
    console.log('Missing customer address', results.items[index]);
    count = count + 1
    console.log('Customers missing addresses: ', count);
  }
}