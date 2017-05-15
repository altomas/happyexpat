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
    //console.log(str);

    if(str.indexOf('Not paid') !== -1)
    {
      requestCallback(null, 0) //"Not paid"
      return;
    }

    if(str.indexOf('Registered') !== -1)
    {
      requestCallback(null, 2)// "new order"
      return;
    }

    if(str.indexOf('_litStatus">Paid on') !== -1)
    {
      requestCallback(null, 5)// "Progress"
      return;
    }

    if(str.indexOf('Not payable or payment received') !== -1)
    {
      requestCallback(null, 10) //"Processed"
      return;
    }

    if(str.indexOf('_lblABSError') !== -1)
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