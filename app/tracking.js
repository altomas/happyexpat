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
    id = id.toLowerCase();

    TrackingModel.findOne({'_id': id }, [] , 
        function (err, trackObj) {
            if (err) {
                error = err;
                 log.error(err);
                return;
            } 
           
            if(trackObj && trackObj.updated > inputDate){
                callback(null, trackObj);
                return;
            }

            console.log('data is being requested')
            requestStatusData(id, function(err, data){
                console.log('data was requested')
                if(err)
                {
                    callback(err);
                    return;
                }

                trackObj = trackObj || TrackingModel({
                        _id: id,
                        status: data,
                        updated: new Date().getTime()
                    });

                trackObj.updated = new Date().getTime();

                if(trackObj.status != data)
                {
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