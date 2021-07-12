const axios = require('axios');
const { v4: uuidv4 } = require('uuid')
const fs = require('fs');
let data = '';

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
      url: 'https://api.fortellis.io/sales/v2/elead/opportunities/search?page=&pageSize=10&dateFrom=05/01/2021&dateTo=05/31/2021',
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
        fs.writeFileSync('Opportunities.json', JSON.stringify(response.data));
        console.log('The number of total items are: ', response.data.totalItems);
        for (let step = 0; step < 1; step++) {
          console.log(`Item ${step + 1} is: `, response.data.items[step]);
          console.log(response.data.items[step].customer.links[0].href);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  })
  .catch(function (error) {
    console.log(error);
  });



