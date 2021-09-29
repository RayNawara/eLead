const axios = require('axios');
const { v4: uuidv4 } = require('uuid')
const fs = require('fs');
import { getToken } from "./get_token";
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
let rawdata = fs.readFileSync('EmpNoDupes.json');
resultsEmployee = JSON.parse(rawdata)
console.log('Number of employees = ', resultsEmployee.length);
// console.log(resultsEmployee);

let step = 0
let emp = 0
let bearerToken, response
let ActivityData = '{"data": ['

getActivities()

async function getActivities() {
  try {
    await getToken()
  } catch (e) {
    console.log('Line 35 - caught exception!', e);
  }

  try {
    await getActivityTypes()
  } catch (e) {
    console.log('Line 41 - caught exception!', e);
  }
  console.log(resultsEmployee[step]);
  console.log(resultsEmployee[0]);
  console.log(resultsEmployee.length);
  try {
    for (step = 0; step < resultsEmployee.length; step++) {
      await getEmployeeActivities(resultsEmployee[step])
    }
  } catch (e) {
    console.log('Line 51 - caught exception!', e);
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
  config = {
    method: 'get',
    url: `https://api.fortellis.io/sales/v1/elead/activities/history/byUserId/${results.id}?fromDate=08/01/2021&toDate=08/31/2021&activityTypes=[]&openActivitiesOnly=false`,
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
    console.log(`Activity for ${results.firstName} ${results.lastName}`);
    ActivityData = ActivityData + JSON.stringify(response.data) + ','
  } else {
    console.log('No Activity for ', `${results.firstName} ${results.lastName}`);
  }

  fs.writeFileSync('Activities.json', ActivityData + ']}');
  // console.log('Log A', response.data);
  // console.log('Log 4', Object.keys(response.data.items[0]))
}
