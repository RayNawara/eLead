const fs = require('fs');

let step = 0

// Read customers
let rawdata = fs.readFileSync('Employee2.json');
results = JSON.parse(rawdata)
console.log('Number of Positions: ', results.data.length);
console.log(results.data[0].items[0]);

let records = [];

for (let step = 0; step < results.data.length; step++) {
  for (let index = 0; index < results.data[step].items.length; index++) {
    records = records.concat(results.data[step].items[index]);
  }
}

console.log('Number of records before removing duplicates = ', records.length);

let uniq = {}
function removeDuplicates(data) {
  return data.filter(obj => !uniq[obj.id] && (uniq[obj.id] = true));
}
newArray = removeDuplicates(records)

console.log('Number of records after removing duplicates = ', newArray.length);

fs.writeFileSync('EmpNoDupes.json', JSON.stringify(newArray));