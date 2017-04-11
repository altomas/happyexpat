var config      = require('./config');
var tracking = require('./tracking');
var bodyParser = require('body-parser');
var log    = require('./log')(module);
var Agenda = require('agenda');
var mailing = require('./mails')();


var agenda = new Agenda({db: { address: config.get('agenda:uri'), collection: 'agendaJobs' }});
agenda.maxConcurrency(1);

agenda.on('ready', function() {
    agenda.define('schedule:statusupdt', function(job, done) {
        var finishJob = function(){
            job.remove(function(err) {
                if(err)
                {
                    log.error(err)
                } 
                
                log.info("Successfully removed job from collection");
            });
        }

        var action = function(actionDone){

              tracking.getStatus(job.attrs.data.caseid, function(err, track){
                if (err) {
                    actionDone(err);
                   log.error(err.message);
                   return;
                }
                
                var processed = track.stats == 10;

                if(processed){
                    //send mail
                    mailing.submit(
                        job.attrs.data.email,
                        'donotreplay subject', 
                        'processed : ' + track, 
                        function(err){
                            
                            if(err){
                                console.log(err);
                                return;
                            }
                            
                            //remove job
                            finishJob();
                        });
                }

                actionDone();
            }); 
          }
       
        action(function (err) {
            if (err) {
                done(error);
                return;
            }

            done();
        });
    });

    agenda.start();
});

var statusupdt = function(data, done){
    var job = agenda.create('schedule:statusupdt', data);
    // TODO: move interval into configuration
    job.repeatEvery('1 day');
    job.unique({'data.caseid': data.caseid, 'data.email': data.email });
    job.save(function(err) {
            if (err) {
                log.error(err);
                done(error);
                return;
            }

            log.info("Job successfully saved");
            done(null, job)
        });
}



module.exports = { scheduleStatusUPDT: statusupdt };