const Mongoose = require('mongoose');

const EleSchema = new Mongoose.Schema({
    href: {
        type: String,
        unique: true,
        required: true,
    },
    
    usageCount: {
        type: Number,
        default: 0,
    },
    
    index: {
        type: Number,
        required: true,
    }
});

module.exports = Mongoose.model('ele', EleSchema);