var log    = require('./log')(module);
var getStatus = require('./getStatus')

var restAPI = function (server){
        server.get('/api', function (req, res) {
            getStatus('AY-6399-QJ',function (err, track) {
                if (!err) {
                    return res.send(track);
                } else {
                    res.statusCode = 500;
                    log.error('Internal error(%d): %s',res.statusCode,err.message);
                    return res.send({ error: err });
                }
            });
    })
}

module.exports = restAPI;