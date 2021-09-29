const axios = require('axios');
const fs = require('fs');
const getToken = require('./get_token.js');
const downloadOpportunities = require('./downloadOpportunities.js');
const addOpportunities = require('./addOpportunities.js');

const subscriptionId = 'dd3a0afc-9c91-4eee-9f4b-77195aee1a1a'

let bearerToken

if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./scratch');
}

(async function () {
  try {
    bearerToken = await getToken()
    console.log(bearerToken);
  } catch (e) {
    console.log('Line 22', e);
  } try {
    // This call will get opportunities and customers
    await downloadOpportunities(axios, fs, subscriptionId, bearerToken)
  } catch (e) {
    console.log('Line 26', e);
  } try {
    // This call will add opportunities, Salesteams, Sought Vehicles and Trade Ins as well as many to many connectors to MySQL DB
    await addOpportunities()
  } catch (e) {
    console.log('Line 31', e);
  }
})();


