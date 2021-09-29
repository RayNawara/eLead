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

// Read Activities
let activityData = fs.readFileSync('Activities2.json');
resultsActivities = JSON.parse(activityData)
console.log('Number of Activities = ', resultsActivities.data.length);


let step = 0
let bearerToken, response
let EmployeeData = '{"data": ['

getAct_Status()

async function getAct_Status() {
  try {
    await await getToken()
  } catch (e) {
    console.log('Line 28 - caught exception!', e);
  }

  try {
    await getActivityOutcome()
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
    // console.log('Line 68 - ', response.data);
    localStorage.setItem('Bearer', bearerToken)
    // console.log(JSON.stringify('Log 1', response.data));
    // console.log('Log 2', response.data);
    return response.data.access_token
  } catch (e) {
    console.log('Line 60 - caught exception!', e);
  }
}

async function getActivityOutcome() {
  // GET- Activities - Get Activity Outcomes
  // Gets the available activity outcomes

  for (let step = 0; step < resultsActivities.data.length - 1; step++) {
    // for (let index = 0; index < resultsActivities.data[step].items.length - 1; index++) {
    for (let index = 0; index < 2; index++) {
      // console.log(`Item  is: `, resultsActivities.data[step].items);
      console.log(`Item ${step + 1} is: `, resultsActivities.data[step].items[index]);
      console.log(resultsActivities.data[step].items[index].id);
      console.log('********************************');
      activityId = resultsActivities.data[step].items[index].id
      console.log('activityId = ', activityId);
      config = {
        method: 'get',
        url: `https://api.fortellis.io/sales/v1/elead/activities/${activityId}/outcomes`,
        headers: {
          'Accept': '',
          'Accept-Charset': '',
          'Prefer': '',
          'Request-Id': requestId,
          'Subscription-Id': subscriptionId,
          'Authorization': `Bearer ${bearerToken}`
        }
      }

      try {
        response = await axios(config)
        console.log('Log 3', response.data);
      } catch (e) {
        console.log('Response Code: ', e.response.status);
        if (e.response.status !== 404) {
          console.log('Line 84 - caught exception!', e);
        }
      }
    }
  }

  // console.log('Log A - Number of Activity Outcomes: ', response.data.items.length);
  // console.log('Log B - Links: ', response.data.links);

  EmployeeData = EmployeeData + JSON.stringify(response.data) + ','

  fs.writeFileSync('ActivityOutcome.json', EmployeeData + ']}');
}

