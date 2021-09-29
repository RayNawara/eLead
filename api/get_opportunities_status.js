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
let EmployeeData = '{"data": ['

getOpp_Status()

async function getOpp_Status() {
  try {
    await await getToken()
  } catch (e) {
    console.log('Line 28 - caught exception!', e);
  }

  try {
    await getOpportunitiesStatus()
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

async function getOpportunitiesStatus() {
  // GET- Get Company Opportunity Statuses
  // Gets the opportunity statuses for the specified company
  config = {
    method: 'get',
    url: 'https://api.fortellis.io/sales/v1/elead/productreferencedata/companyOpportunityStatuses',
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
    console.log('Line 84 - caught exception!', e);
  }
  console.log('Log A - Number of Statuses: ', response.data.items.length);
  console.log('Log B - Links: ', response.data.links);

  EmployeeData = EmployeeData + JSON.stringify(response.data) + ','

  fs.writeFileSync('OppStatus.json', EmployeeData + ']}');
}

