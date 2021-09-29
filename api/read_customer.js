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
console.log('Customer info: ', results[0].items[0].customer.links[0].href);

// console.log('Item 6 length = ', results[5].items.length);

// "totalItems": 5397,
//     "totalPages": 6,
//     "pageNumber": 1,
//     "pageSize": 1000,
//     "items": [

let records = [];
let pagenum = 0;
let totalPages = results[0].totalPages;

for (let step = 0; step < totalPages; step++) {
  for (let index = 0; index < results[step].items.length; index++) {
    records = records.concat(results[step].items[index].customer.links[0].href);
  }
}

console.log('Number of records before removing duplicates = ', records.length);

function removeDuplicates(data) {
  return data.filter((value, index) => data.indexOf(value) === index)
}
newArray = removeDuplicates(records)

console.log('Number of records after removing duplicates = ', newArray.length);

fs.writeFileSync('Cust2.json', JSON.stringify(newArray));