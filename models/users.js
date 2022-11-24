const mongoose = require('mongoose');

const usersSchema = mongoose.Schema({
    name:{
        type: String
    },
    username:{
        type: String
    },
    password:{
        type: String
    }
});

const users= mongoose.model('users', usersSchema);
module.exports = users;