var http = require('https');


var requestData = function(id, requestCallback)
{
  var options = {
  method: 'GET',
  port: 443,
  hostname: 'www.nyidanmark.dk',
  path: '/en-us/coming_to_dk/fee/Payment/Payment.htm?ABID=' + id
  };

  callback = function(response) {
  var str = '';

  response.on('data', function (chunk) {
    str += chunk;
  });

  response.on('end', function () {

    var paidSubstring = '_litStatus">Paid on';
    if(str.indexOf(paidSubstring) !== -1)
    {
      console.log('In Progress');
      requestCallback(null, 5)// "Progress"
      return;
    }
    
    var processedSubstring = 'Not Payable or Payment received';
    if(str.indexOf(processedSubstring) !== -1)
    {
      console.log('Processed');
      requestCallback(null, 10) //"Processed"
      return;
    }

    var errorSubstring = '_lblABSError';
    if(str.indexOf(errorSubstring) !== -1)
    {
      console.log('General error, probably incorrect case order ID');
      requestCallback({message: 'General error, probably incorrect case order ID'})
      return;
    }
  });
}

  http.request(options, callback).end();
}

 

module.exports = requestData;