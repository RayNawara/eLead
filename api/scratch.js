const fs = require('fs');

let rawdataCustomer = fs.readFileSync('Customers.json');
customerData = rawdataCustomer.slice(0, -3) + ']}'
console.log(customerData);
// let resultsCustomer = JSON.parse(customerData)
// console.log(resultsCustomer);
fs.writeFileSync('Customer2.json', customerData);
// console.log(resultsCustomer);
// let numberOfCustomers = resultsCustomer.length
// console.log(numberOfCustomers);