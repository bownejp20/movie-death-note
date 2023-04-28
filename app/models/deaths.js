// load the things we need
const {Schema, model} = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

// define the schema for our user model
const typesOfDeathSchema = Schema({death:Array});

// create the model for users and expose it to our app
module.exports = model('TypesOfDeath', typesOfDeathSchema);
