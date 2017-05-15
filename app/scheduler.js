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
              
                var processed = track.status == 10;

                if(processed){
                    //send mail
                    mailing.submit(
                        job.attrs.data.email,
                        'do not replay (visa status update)', 
                        'Yor application (caseid: '+ track._id + ') was processed, please wait for mail on your post address', 
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
    job.unique({'data.caseid': data.caseid.toLowerCase(), 'data.email': data.email.toLowerCase() });
    job.save(function(err) {

            if (err) {
                log.error(err);
                done(error);
                return;
            }

            mailing.submit(
                        job.attrs.data.email,
                        'Do Not replay (visa status subscription)', 
                        'You are subscribed for notification about visa processing status (caseid: '+ job.attrs.data.caseid + '), next notification mail you will get when your application is processed. We cannot inform you regarding positive or negative result cause this information is confidential, once your application is processed you will get post mail with resolution', 
                        function(err){
                            
                            if(err){
                                log.error(err);
                            }
                        });
                        
            log.info("Job successfully saved");
            done(null, job)
        });
}



module.exports = { scheduleStatusUPDT: statusupdt };