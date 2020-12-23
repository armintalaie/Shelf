const mongoose = require('mongoose')
const Schema = mongoose.Schema




const ProductSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Name field required']
    },
    img: {
        type: Buffer,

    },
    price: {
        type: Number
    },
    quantity: {
        type: Number
    }

})


const Product = mongoose.model('product', ProductSchema)

module.exports = Product