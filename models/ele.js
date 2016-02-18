const Mongoose = require('mongoose');

const EleSchema = new Mongoose.Schema({
    href: {
        type: String,
        unique: true,
    },
    
    usageCount: {
        type: Number
    }
});

module.exports = Mongoose.model('ele', EleSchema);