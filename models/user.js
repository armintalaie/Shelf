const mongoose = require('mongoose')
const Schema = mongoose.Schema


const UserSchema = new Schema({
    email: {
        type: String
    },

    password: {
        type: String
    },

    products: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'product' }
    ]

})

const User = mongoose.model('user', UserSchema)

module.exports = User