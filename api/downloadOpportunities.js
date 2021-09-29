const getCustomers = require("./get_customers");
const getDate = require("./getDate");

const { v4: uuidv4 } = require('uuid')
const requestId = uuidv4()

let ActivityData = '{"items": ['

async function downloadOpportunities(axios, fs, subscriptionId, bearerToken) {

  let records = [];
  let pagenum = 0;
  let totalPages = 0;

  // getDate is a small function to get 2 days ago and yesterday for our eLead call

  dates = getDate()
  let dateFrom = dates[0]
  let dateTo = dates[1]
  // console.log(dateFrom, dateTo);

  do {
    pagenum = ++pagenum
    console.log(subscriptionId);
    let config = {
      method: 'get',
      url: `https://api.fortellis.io/sales/v2/elead/opportunities/search?page=${pagenum}&pageSize=1000&dateFrom=${dateFrom}&dateTo=${dateTo}`,
      headers: {
        'Accept': '',
        'Accept-Charset': '',
        'Prefer': '',
        'Request-Id': requestId,
        'Subscription-Id': subscriptionId,
        'Authorization': `Bearer ${bearerToken}`
      }
    };
    console.log('Line 32 - ', config);
    try {
      response = await axios(config)
      // console.log(response.data);
    } catch (error) {
      console.log('Line 36 - ', error);
    }
    // let { data: response }  = await axios.get(url, { params: { page: ++page } });
    totalPages = response.data.totalPages;
    console.log(`downloadRecords: page ${pagenum} of ${totalPages} downloaded...`);
    console.log(`Total Items: ${response.data.totalItems}`);
    records = records.concat(response.data);
    // console.log(response.data);
    try {
      // console.log('Line 48 ', response.data.totalItems);
      ActivityData = await getCustomers(axios, subscriptionId, response.data.items, bearerToken)
      // console.log('download - line 50', ActivityData);
    } catch (error) {
      console.log('Line 52 - ', error);
    }
    // console.log("records.length:", records.length);
  } while (pagenum < totalPages)

  fs.writeFileSync('Oppo2.json', JSON.stringify(records));


  console.log("downloadRecords: download complete.")
}

module.exports = downloadOpportunities