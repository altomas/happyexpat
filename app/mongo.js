var mongoose    = require('mongoose');
var log         = require('./log')(module);
var config      = require('./config');
var upsert = require('mongoose-upsert');

var connectionMongo = process.env.MONGODB_URI || config.get('mongoose:uri');

mongoose.connect(config.get('mongoose:uri'));
var db = mongoose.connection;

db.on('error', function (err) {
    log.error('connection error:', err.message);
});
db.once('open', function callback () {
    log.info("Connected to DB!");
});

var Schema = mongoose.Schema;

// Schemas
var TrackingSchema = new Schema({
    _id:{ type: String, required: true },
    status: { type: Number, required: false },
    email: { type: String, required: false },
    updated: {type: Date, required: false}
});


TrackingSchema.plugin(upsert);


// validation
TrackingSchema.path('email').validate(function (v) {
    return true;
});

var TrackingModel = mongoose.model('Tracking', TrackingSchema);

module.exports.TrackingModel = TrackingModel;