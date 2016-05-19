// grab things we need
var mongoose = require("mongoose");
var Schema = mongoose.Schema;

// create schema
var leaderSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

var Leaderships = mongoose.model("Leadership", leaderSchema);

module.exports = Leaderships;