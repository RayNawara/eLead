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

getOpps()

async function getOpps() {
  try {
    await await getToken()
  } catch (e) {
    console.log('Line 26 - caught exception!', e);
  }

  try {
    await downloadOpportunities()
  } catch (e) {
    console.log('Line 34 - caught exception!', e);
  }
}

async function getToken() {
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

  try {
    response = await axios(config)
    bearerToken = response.data.access_token
    console.log('Line 52 - ', response.data);
    localStorage.setItem('Bearer', bearerToken)
    console.log(JSON.stringify('Line 54', response.data));
    console.log('Line 55', response.data);
    return response.data.access_token
  } catch (e) {
    console.log('Line 58 - caught exception!', e);
  }
}


async function downloadOpportunities() {

  let records = [];
  let pagenum = 0;
  let totalPages = 0;

  do {
    pagenum = ++pagenum
    let config = {
      method: 'get',
      url: `https://api.fortellis.io/sales/v2/elead/opportunities/search?page=${pagenum}&pageSize=1000&dateFrom=09/27/2021&dateTo=09/28/2021`,
      headers: {
        'Accept': '',
        'Accept-Charset': '',
        'Prefer': '',
        'Request-Id': requestId,
        'Subscription-Id': subscriptionId,
        'Authorization': `Bearer ${bearerToken}`
      }
    };
    // console.log('Line 77 - ', config);
    response = await axios(config)
    // let { data: response }  = await axios.get(url, { params: { page: ++page } });
    totalPages = response.data.totalPages;
    console.log(`downloadRecords: page ${pagenum} of ${totalPages} downloaded...`);
    console.log(response.data.totalPages);
    records = records.concat(response.data);
    await getCustomers(response.data)
    console.log("records.length:", records.length);
  } while (pagenum < totalPages)

  fs.writeFileSync('Oppo2.json', JSON.stringify(records));
  fs.writeFileSync('CustsA.json', ActivityData + ']}');

  console.log("downloadRecords: download complete.")
}

async function getCustomers(axios, results, bearerToken) {
  // GET- Customers - Get Customer
  // console.log('URL = ', results[step]);
  config = {
    method: 'get',
    url: `${response.data[step].customer.links[0].href}`,
    headers: {
      'Accept': '',
      'Accept-Charset': '',
      'Prefer': '',
      'Request-Id': requestId,
      'Subscription-Id': subscriptionId,
      'Authorization': `Bearer ${bearerToken}`
    }
  };
  // console.log(step);
  // console.log('Log 10', results[step]);
  response = await axios(config)
  // console.log(response.data);
  ActivityData = ActivityData + JSON.stringify(response.data) + ','

}