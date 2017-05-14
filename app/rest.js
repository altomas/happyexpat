var log    = require('./log')(module);
var tracking = require('./tracking');
var config      = require('./config');
var scheduler      = require('./scheduler');
var bodyParser = require('body-parser');
var mailing = require('./mails')();

var restAPI = function (server){

    server.use(bodyParser.json()); // support json encoded bodies
    server.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
    
    // server.get('/api/schedule', function (req, res) {
    //        var mail = "altomas@yandex.ru";
    //        var caseid = 'AY-6399-QJ';

    //        scheduler.scheduleStatusUPDT({caseid:caseid , email: mail}, function(err, job){
                
    //             if(err){
    //                 log.error(err);
    //             }

    //             return res.send({ error: err, job: job });
    //     }); 

    // });


    server.get('/api/getstatus/:caseid', function (req, res) {
            tracking.getStatus(req.params.caseid,function (err, track) {
                    if(err){
                        log.error(err);
                    }
                    return res.send( { error: err, tracking: track } );
            });
    });
    
    // POST http://localhost:8080/api/subscribe
    // parameters sent with 
    server.post('/api/subscribe', function(req, res) {
        var caseid = req.body.caseid;
        var mail = req.body.mail;
        
        scheduler.scheduleStatusUPDT({caseid:caseid , email: mail}, function(err, job){
                if(err){
                    log.error(err);
                }
                
                return res.send({ error: err, job: job });
        });       
    });

}

module.exports = restAPI;