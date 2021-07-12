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
// Read employees
let rawdata = fs.readFileSync('Employees.json');
employeeData = rawdata.slice(0, -3) + ']}'
resultsEmployee = JSON.parse(employeeData)
fs.writeFileSync('Employee2.json', employeeData);
console.log('Number of employees = ', resultsEmployee.data.length);

let step = 0
let emp = 0
let bearerToken, response
let ActivityData = '{"data": ['

getActivities()

async function getActivities() {
  try {
    await await getToken()
  } catch (e) {
    console.log('Line 40 - caught exception!', e);
  }

  try {
    await getActivityTypes()
  } catch (e) {
    console.log('Line 46 - caught exception!', e);
  }

  try {
    for (step = 0; step < resultsEmployee.data.length - 1; step++) {
      for (emp = 0; emp < resultsEmployee.data[step].items.length - 1; emp++) {
        await getEmployeeActivities(resultsEmployee.data)
      }
    }
  } catch (e) {
    console.log('Line 54 - caught exception!', e);
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
    // console.log('Line 68 - ', response.data);
    localStorage.setItem('Bearer', bearerToken)
    // console.log(JSON.stringify('Log 1', response.data));
    // console.log('Log 2', response.data);
    return response.data.access_token
  } catch (e) {
    console.log('Line 70 - caught exception!', e);
  }
}

async function getActivityTypes() {
  // GET- Activities - Get Activity Types
  config = {
    method: 'get',
    url: 'https://api.fortellis.io/sales/v1/elead/activities/types',
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
}

async function getEmployeeActivities(results) {
  // console.log(results[step].items[emp]);
  config = {
    method: 'get',
    url: `https://api.fortellis.io/sales/v1/elead/activities/history/byUserId/${results[step].items[emp].id}?fromDate=05/01/2021&toDate=05/31/2021&activityTypes=[]&openActivitiesOnly=false`,
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
  // console.log('Log 10', results.data[step].id);
  response = await axios(config)
  if (response.data.items.length != 0) {
    console.log('$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$');
    ActivityData = ActivityData + JSON.stringify(response.data) + ','
  } else {
    console.log('No Activity!');
  }

  fs.writeFileSync('Activities.json', ActivityData + ']}');
  // console.log('Log A', response.data);
  // console.log('Log 4', Object.keys(response.data.items[0]))
}
