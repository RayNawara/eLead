const axios = require('axios');
const { v4: uuidv4 } = require('uuid')
const fs = require('fs');
let data = '';

const CLIENT_ID = "VfafEKLDRmUgOXl5D4YVFckiClXGgT3k";
const CLIENT_SECRET = "zvHgyvYIgAQUQNEr";
const requestId = uuidv4()
const subscriptionId = 'dd3a0afc-9c91-4eee-9f4b-77195aee1a1a'

const token = Buffer.from(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64');

if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./scratch');
}

let step = 0
let bearerToken, response
let EmployeeData = ''

getEmployees()

async function getEmployees() {
  try {
    await await getToken()
  } catch (e) {
    console.log('Line 40 - caught exception!', e);
  }

  try {
    await getCompanyPositions()
  } catch (e) {
    console.log('Line 46 - caught exception!', e);
  }

  // try {
  //   for (step = 0; step < num_of_items - 1; step++) {
  //     await getOpportunityActivities()
  //   }
  // } catch (e) {
  //   console.log('Line 54 - caught exception!', e);
  // }
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
    // console.log('Line 68 - ', response.data);
    localStorage.setItem('Bearer', bearerToken)
    // console.log(JSON.stringify('Log 1', response.data));
    // console.log('Log 2', response.data);
    return response.data.access_token
  } catch (e) {
    console.log('Line 70 - caught exception!', e);
  }
}

async function getCompanyPositions() {
  // GET- Get Company Positions
  config = {
    method: 'get',
    url: 'https://api.fortellis.io/sales/v1/elead/productreferencedata/companyPositions',
    headers: {
      'Accept': '',
      'Accept-Charset': '',
      'Prefer': '',
      'Request-Id': requestId,
      'Subscription-Id': subscriptionId,
      'Authorization': `Bearer ${bearerToken}`
    }
  };

  try {
    response = await axios(config)
    console.log('Log 3', response.data);
  } catch (e) {
    console.log('Line 94 - caught exception!', e);
  }
  console.log('Log A - Number of Positions: ', response.data.items.length);
  console.log('Log B', response.data.items[0].links[0].href);
  console.log('Log C', response.data);
  for (let i = 0; i < response.data.items.length; i++) {

    console.log('Name = ', `${response.data.items[i].name}`);
    config = {
      method: 'get',
      url: `https://api.fortellis.io/sales/v1/elead/productreferencedata/companyEmployees?positionName=${response.data.items[i].name}`,
      headers: {
        'Accept': '',
        'Accept-Charset': '',
        'Prefer': '',
        'Request-Id': requestId,
        'Subscription-Id': subscriptionId,
        'Authorization': `Bearer ${bearerToken}`
      }
    };

    try {
      response2 = await axios(config)
      // console.log('Log 3', response2.data);
    } catch (e) {
      if (response.status != '404') {
        console.log('Line 94 - caught exception!', e, 'Data = ', response2.data);
      }
    }

    EmployeeData = EmployeeData + JSON.stringify(response2.data) + ','

    fs.writeFileSync('Employees.json', EmployeeData);
  }
}


async function getOpportunityActivities() {
  config = {
    method: 'get',
    url: `https://api.fortellis.io/sales/v1/elead/activities/history/byOpportunityId/${results.items[step].id}`,
    headers: {
      'Accept': '',
      'Accept-Charset': '',
      'Prefer': '',
      'Request-Id': requestId,
      'Subscription-Id': subscriptionId,
      'Authorization': `Bearer ${bearerToken}`
    }
  };
  // console.log('Log 9', config);
  // console.log('Log 10', results.items[step].id);
  response = await axios(config)
  EmployeeData = EmployeeData + JSON.stringify(response.data) + ','

  fs.writeFileSync('Employees.json', EmployeeData + ']}');
  // console.log('Log A', response.data);
  // console.log('Log 4', Object.keys(response.data.items[0]))
}
