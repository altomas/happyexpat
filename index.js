require('newrelic');
var server = require('./app/server');
var log    = require('./app/log')(module);
var config          = require('./app/config');

var port = process.env.PORT || config.get('port');

server.listen(port, function(){
    log.info('Express server listening on port: '
     + port);
}); 