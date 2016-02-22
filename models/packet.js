const Mongoose = require('mongoose');

const PacketSchema = new Mongoose.Schema({
    href: {
        type: String,
        unique: true,
        required: true,
    },
    
    type: {
        type: String,
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

module.exports = Mongoose.model('packet', PacketSchema);