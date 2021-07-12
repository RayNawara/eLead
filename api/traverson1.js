var traverson = require('traverson');

traverson
  .from('http://api.example.com')
  .follow('link_to', 'resource')
  .getResource(function (error, document) {
    if (error) {
      console.error('No luck :-)')
    } else {
      console.log('We have followed the path and reached the target resource.')
      console.log(JSON.stringify(document))
    }
  });