const Mongoose = require('mongoose');

const UserSchema = new Mongoose.Schema({
    nickname: {
        type: String,
        unique: true,
        required: true,
    },
    
    usageIndex: {
        type: Number,
        default: -1,
    }
});

module.exports = Mongoose.model('user', UserSchema);