// Statuses:
// 0 - not paid
// 2 - registered
// 5 - in progress
// 10 - processed

var log                 = require('./log')(module);
var TrackingModel       = require('./models/tracking.model').TrackingModel;
var requestStatusData   = require('./provider');

 var getStatusfn = function (id, callback){
//1000*3600*24
    var inputDate = new Date(new Date().valueOf() - 1000*3600*24);

    TrackingModel.findOne({'_id': id }, [] , 
        function (err, trackObj) {
            if (err) {
                error = err;
                 console.log(err);
                return;
            } 
           
            if(trackObj && trackObj.updated > inputDate){
                callback(null, trackObj);
                return;
            }

            requestStatusData(id, function(err, data){
                if(err)
                {
                    callback(err);
                    return;
                }

                trackObj = trackObj || TrackingModel({
                        _id: id,
                        status: 0,
                        email: "",
                        updated: new Date().getTime()
                    });

                trackObj.updated = new Date().getTime();

                // claryfing of status
                // if case order is not paid or processed it will return the same status 10 
                // but we can easilly detect if the paiment was not done just check that 
                // prevstatus does not exist. If prevstatus == undefined it means case order 
                // was not paid yet
                if(!trackObj.prevstatus  && 10 == data)
                {
                    data = 0;
                }

                if(trackObj.status != data)
                {
                    trackObj.prevstatus = trackObj.status;
                    trackObj.status = data;
                }
                //END  claryfing of status

                TrackingModel.findOneAndUpdate({'_id': id }, 
                    trackObj, 
                    {upsert: true, new: true, runValidators: true}, 
                    function (err) {
                        if (err) {
                            console.log(err);
                            if(err.name == 'ValidationError') {
                            
                            } else {
                                
                            }

                            log.error('Internal error(%d): %s', err.message);
                        }
                    });

                    callback(null, trackObj);
                });
        });
}

module.exports = { getStatus: getStatusfn };