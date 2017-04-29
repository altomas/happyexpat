var mongoose    = require('mongoose');
var log         = require('../log')(module);
var upsert = require('mongoose-upsert');

var Schema = mongoose.Schema;

// Schemas
var TrackingSchema = new Schema({
    _id:{ type: String, required: true },
    status: { type: Number, required: false },
    updated: {type: Date, required: false}
});


TrackingSchema.plugin(upsert);

var TrackingModel = mongoose.model('Tracking', TrackingSchema);

module.exports.TrackingModel = TrackingModel;