const fs = require('fs');

let rawdata = fs.readFileSync('Opportunities.json');
let results = JSON.parse(rawdata)
if (results.pageSize < results.totalItems) {
  num_of_items = results.pageSize
}
else {
  num_of_items = results.totalItems;
}
console.log('Number of items: ', num_of_items);
// console.log(results.items[1618]);
// console.log(results.items[1618].id, results.items[1618].salesTeam[0].id);

for (let index = 0; index < num_of_items; index++) {
  if (!results.items[index].customer) {
    console.log('Missing customer', results.items[index]);
  }
}