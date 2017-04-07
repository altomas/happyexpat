var log    = require('./log')(module);
var tracking = require('./tracking');

var bodyParser = require('body-parser');

var restAPI = function (server){

    server.use(bodyParser.json()); // support json encoded bodies
    server.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
    
    server.get('/api/:caseid', function (req, res) {
            console.log(tracking)
console.log(tracking.getStatus)
            tracking.getStatus(req.params.caseid,function (err, track) {
                if (!err) {
                    return res.send(track);
                } else {
                    res.statusCode = 500;
                    log.error('Internal error(%d): %s',res.statusCode,err.message);
                    return res.send({ error: err });
                }
            });
    });

    // POST http://localhost:8080/api/subscribe
    // parameters sent with 
    server.post('/api/subscribe', function(req, res) {
        var caseid = req.body.caseid;
        var mail = req.body.mail;
      

        res.send(caseid + ' ' + mail);
    });

}

module.exports = restAPI;