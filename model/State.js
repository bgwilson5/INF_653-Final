const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/* 
Schema for Mongoose/MongoDB
Stores the funfacts in the database
*/
const stateSchema = new Schema({
  // The two-char code for the state
  statecode: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
  },
  // An array of fun facts about the state
  funfacts: {
    type: [String],
  },
});

module.exports = mongoose.model('State', stateSchema);