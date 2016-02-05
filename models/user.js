const Mongoose = require('mongoose');

const userSchema = new Mongoose.Schema({
    nickname: {
        type: String,
        unique: true,
    },
    
    usageIndex: {
        type: Number
    }
});

module.exports = Mongoose.model('ele', userSchema);