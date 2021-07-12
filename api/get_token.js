const R = require("request");

let url = 'https://identity.fortellis.io/oauth2/aus1p1ixy7YL8cMq02p7/v1/token/?grant_type=client_credentials&scope=anonymous';
const CLIENT_ID = "VfafEKLDRmUgOXl5D4YVFckiClXGgT3k";
const CLIENT_SECRET = "zvHgyvYIgAQUQNEr";

const token = Buffer.from(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64');

let bearerToken

if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./scratch');
}

R({
  url: url,
  method: 'POST',
  headers: {
    accept: 'application/json',
    authorization: `Basic ${token}`,
    "Content-Type": "Content-Type: application/x-www-form-urlencoded"
  },
  body: "grant_type=client_credentials&scope=anonymous"

}, function (err, resp, body) {
  console.log('Line 20');
  console.dir(body); //the bearer token...
  let json = JSON.parse(body)
  bearerToken = json.access_token
  localStorage.setItem('Bearer', bearerToken)
});

// url = 'https://api.vinsolutions.com/gateway/v1/organization/dealers';

// R({
//   url: url,
//   method: 'GET',
//   json: true,
//   headers: {
//     "Content-Type": "Content-Type: application/json",
//     "Authorization": "Bearer " + bearerToken,
//     "api_key": "b484a6a833914d779510e7d4cf37686d"
//   }

// }, function (err, resp, body) {
//   console.dir(body);
// });