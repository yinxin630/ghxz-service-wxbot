const mongodbAddress = require('../config/mongodb.js');
const Mongoose = require('mongoose');

module.exports = Mongoose.connect(mongodbAddress);