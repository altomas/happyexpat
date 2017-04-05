var server = require('./app/server');
var log    = require('./app/log')(module);
var config          = require('./app/config');

var port = config.get('port');

server.listen(port, function(){
    log.info('Express server listening on port: '
     + config.get('port'));
}); 