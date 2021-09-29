// At this point I have have setup my config to get my Token and I'm going to get all the opportunities available

axios(config)
  .then(function (response) {
    bearerToken = response.data.access_token
    localStorage.setItem('Bearer', bearerToken)
    console.log(JSON.stringify(response.data));

    config = {
      method: 'get',
      url: 'https://api.fortellis.io/sales/v2/elead/opportunities/search?page=&pageSize=5000&dateFrom=05/01/2021&dateTo=05/30/2021',
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
        console.log(Object.keys(response.data.items[0]))
        if ('soughtVehicles' in response.data.items[0]) {
          console.log(Object.keys(response.data.items[0].soughtVehicles[0]))
        }
        if ('salesTeam' in response.data.items[0]) {
          console.log(Object.keys(response.data.items[0].salesTeam[0]))
        }
        fs.writeFileSync('Opportunities.json', JSON.stringify(response.data));
        console.log('The number of total items are: ', response.data.totalItems);
        console.log('The number of total items per  page are: ', response.data.pageSize);
        if (response.data.pageSize < response.data.totalItems) {
          totItems = response.data.pageSize
        } else {
          totItems = response.data.totalItems
        }

        // write out links to customer records
        for (let i = 0; i < totItems; i++) {
          console.log('Line 69 - i = ', i);
          // customerData = customerData + 'id:' + response.data.items[i].customer.id;
          // console.log(customerData);
          config = {
            method: 'get',
            url: response.data.items[i].customer.links[0].href,
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
              // show customer
              // console.log('###################################', Object.keys(response.items).length);

              customerData = customerData + JSON.stringify(response.data) + ','

              fs.writeFileSync('Customers.json', customerData + ']}');
            })
        }