const mongoose = require('mongoose')
const Schema = mongoose.Schema


const ProductSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Name field required']
    },
    img: { data: Buffer, contentType: String },
    quantity: {
        type: Number
    },
    price: {
        type: Number
    }

    ,
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }



})


const Product = mongoose.model('product', ProductSchema)

module.exports = Product