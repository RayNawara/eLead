const { v4: uuidv4 } = require('uuid')
const requestId = uuidv4()
const fs = require('fs');

let ActivityData = '{"items": ['

async function getCustomers(axios, subscriptionId, results, bearerToken) {
  // console.log('Results.Length = ', results.length);
  for (let index = 0; index < results.length; index++) {
    // console.log('Line 7 in getCustomers', results[index].customer.links[0].href)
    config = {
      method: 'get',
      url: `${results[index].customer.links[0].href}`,
      headers: {
        'Accept': '',
        'Accept-Charset': '',
        'Prefer': '',
        'Request-Id': requestId,
        'Subscription-Id': subscriptionId,
        'Authorization': `Bearer ${bearerToken}`
      }
    };
    response = await axios(config)
    // console.log(response.data);
    return ActivityData = ActivityData + JSON.stringify(response.data) + ','
  }
  fs.writeFileSync('CustsA.json', ActivityData + ']}');
}

module.exports = getCustomers