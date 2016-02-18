const Mongoose = require('mongoose');

const UserSchema = new Mongoose.Schema({
    nickname: {
        type: String,
        unique: true,
    },
    
    usageIndex: {
        type: Number
    }
});

module.exports = Mongoose.model('user', UserSchema);