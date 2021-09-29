async function getToken() {

  const axios = require('axios');
  let data = '';

  const CLIENT_ID = "VfafEKLDRmUgOXl5D4YVFckiClXGgT3k";
  const CLIENT_SECRET = "zvHgyvYIgAQUQNEr";

  const token = Buffer.from(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64');

  if (typeof localStorage === "undefined" || localStorage === null) {
    var LocalStorage = require('node-localstorage').LocalStorage;
    localStorage = new LocalStorage('./scratch');
  }

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
    console.log('GetToken Line 40 - caught exception!', e);
  }
}
module.exports = getToken