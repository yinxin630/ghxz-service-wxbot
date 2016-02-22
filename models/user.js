const Mongoose = require('mongoose');

const UserSchema = new Mongoose.Schema({
    nickname: {
        type: String,
        unique: true,
        required: true,
    },
    
    eleUsageIndex: {
        type: Number,
        default: -1,
    },
    
    didiUsageIndex: {
        type: Number,
        default: -1,
    },
});

module.exports = Mongoose.model('user', UserSchema);