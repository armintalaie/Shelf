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

})


const Product = mongoose.model('product', ProductSchema)

module.exports = Product