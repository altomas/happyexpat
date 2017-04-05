var server = require('./app/server');
var log    = require('./app/log')(module);
var config          = require('./app/config');

server.listen(config.get('port'), function(){
    log.info('Express server listening on port: '
     + config.get('port'));
}); 