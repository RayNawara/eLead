const axios = require('axios');
const { v4: uuidv4 } = require('uuid')
const fs = require('fs');
let data = '';
let customerData = '{"items": ['
let totItems, oppLink

const CLIENT_ID = "VfafEKLDRmUgOXl5D4YVFckiClXGgT3k";
const CLIENT_SECRET = "zvHgyvYIgAQUQNEr";
const requestId = uuidv4()
const subscriptionId = 'dd3a0afc-9c91-4eee-9f4b-77195aee1a1a'

const token = Buffer.from(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64');

let bearerToken

if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./scratch');
}

let config = {
  method: 'post',
  url: 'https://identity.fortellis.io/oauth2/aus1p1ixy7YL8cMq02p7/v1/token?grant_type=client_credentials&scope=anonymous',
  headers: {
    'Accept': 'Application/json',
    'Cache-Control': 'No-cache',
    'Content-Type': 'Application/x-www-form-urlencoded',
    'Authorization': `Basic ${token}`
  },
  data: data
};

axios(config)
  .then(function (response) {
    bearerToken = response.data.access_token
    localStorage.setItem('Bearer', bearerToken)
    console.log(JSON.stringify(response.data));

    config = {
      method: 'get',
      url: 'https://api.fortellis.io/sales/v2/elead/opportunities/search?page=&pageSize=5000&dateFrom=08/15/2021&dateTo=09/01/2021',
      headers: {
        'Accept': '',
        'Accept-Charset': '',
        'Prefer': '',
        'Request-Id': requestId,
        'Subscription-Id': subscriptionId,
        'Authorization': `Bearer ${bearerToken}`
      }
    };

    axios(config)
      .then(function (response) {
        // console.log(JSON.stringify(response.data));
        console.log(Object.keys(response.data.items[0]))
        if ('soughtVehicles' in response.data.items[0]) {
          console.log(Object.keys(response.data.items[0].soughtVehicles[0]))
        }
        if ('salesTeam' in response.data.items[0]) {
          console.log(Object.keys(response.data.items[0].salesTeam[0]))
        }
        fs.writeFileSync('Opportunities.json', JSON.stringify(response.data));
        console.log('The number of total items are: ', response.data.totalItems);
        console.log('The number of total items per  page are: ', response.data.pageSize);
        if (response.data.pageSize < response.data.totalItems) {
          totItems = response.data.pageSize
        } else {
          totItems = response.data.totalItems
        }

        // write out links to customer records
        for (let i = 0; i < totItems; i++) {
          console.log('Line 74 - i = ', i);
          // customerData = customerData + 'id:' + response.data.items[i].customer.id;
          // console.log(customerData);
          config = {
            method: 'get',
            url: response.data.items[i].customer.links[0].href,
            headers: {
              'Accept': '',
              'Accept-Charset': '',
              'Prefer': '',
              'Request-Id': requestId,
              'Subscription-Id': subscriptionId,
              'Authorization': `Bearer ${bearerToken}`
            }
          };

          axios(config)
            .then(function (response) {
              // show customer
              // console.log('###################################', Object.keys(response.items).length);

              customerData = customerData + JSON.stringify(response.data) + ','

              fs.writeFileSync('Customers.json', customerData + ']}');
            })
        }
        // log first customer
        for (let step = 0; step < 1; step++) {
          console.log(`Item ${step + 1} is: `, response.data.items[step]);
          console.log(response.data.items[step].customer.links[0].href);
          console.log('********************************');
          if ('soughtVehicles' in response.data.items[step]) {
            console.log(response.data.items[step].soughtVehicles[0].id);
          }
          console.log('Line 108', response.data.items[step].links[1].href);
          oppLink = response.data.items[step].links[1].href
          console.log('oppLink = ', oppLink);
          config = {
            method: 'get',
            url: response.data.items[step].customer.links[0].href,
            headers: {
              'Accept': '',
              'Accept-Charset': '',
              'Prefer': '',
              'Request-Id': requestId,
              'Subscription-Id': subscriptionId,
              'Authorization': `Bearer ${bearerToken}`
            }
          };

          axios(config)
            .then(function (response) {
              // show customer
              console.log(JSON.stringify(response.data, null, 2));
              console.log('line 92 - ', oppLink);

              config = {
                method: 'get',
                url: oppLink,
                headers: {
                  'Accept': '',
                  'Accept-Charset': '',
                  'Prefer': '',
                  'Request-Id': requestId,
                  'Subscription-Id': subscriptionId,
                  'Authorization': `Bearer ${bearerToken}`
                }
              }

              axios(config)
                .then(function (response) {
                  console.log('line 109');
                  console.log(JSON.stringify(response.data, null, 2));
                })
                .catch(function (error) {
                  console.log(error);
                });
            })
            .catch(function (error) {
              console.log(error);
            })
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  })

