var log                 = require('./log')(module);
var TrackingModel       = require('./models/tracking.model').TrackingModel;
var requestStatusData   = require('./provider');

 var getStatusfn = function (id, callback){
    TrackingModel.findOne({'_id': id }, [] , function (err, trackObj) {
        if (err) {
            error = err;
            return;
        } 

        if(trackObj){
            callback(null, trackObj);
            return;
        }

        requestStatusData(id, function(err, data){
        if(err)
        {
            callback(err);
            return;
        }

        var tracking = TrackingModel({
                _id: id,
                status: data,
                email: "",
                updated: new Date().getTime()
            });

        TrackingModel.findOneAndUpdate({'_id': id }, 
            tracking, 
            {upsert: true, new: true, runValidators: true}, 
            function (err) {
                if (!err) {
                
                } else {
                    console.log(err);
                    if(err.name == 'ValidationError') {
                    
                    } else {
                        
                    }

                    log.error('Internal error(%d): %s', err.message);
                }
            });

            callback(null, tracking);
        });
    });
}

module.exports = { getStatus: getStatusfn };