const mongoose = require('mongoose')
const mongooseSchema = require('mongoose').Schema


const userSchema = new mongooseSchema({
    username: {
        type: String
    },
    password: {
        type: String
    }
})

const User = mongoose.model('User', userSchema)
module.exports = User