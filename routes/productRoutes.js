const express = require('express')
const router = express.Router()
const Product = require('../models/product')
var bodyParser = require('body-parser')
var multer = require('multer')
const fs = require('fs')
const mongoose = require('mongoose')
var path = require('path')
    //const storage = require('../app')

// setting storage
storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, __dirname + '/../uploads/products')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
})


var upload = multer({ storage: storage });



router.get('/products/create', (req, res) => {
    res.render('create')
})



// create product
router.get('/product/create', (req, res) => {
    res.render('post')

})


// creating new product
router.post('/products/create', upload.single('image'), (req, res, next) => {

    if (!req.file) {
        console.log("No file received");
    }

    console.log('hello')
    var product = new Product;
    product.img = {
        data: fs.readFileSync(path.join(__dirname + '/../uploads/products/' + req.file.filename)),
        contentType: 'image/png'
    }
    product.name = req.body.name
    product.price = req.body.price
    product.quantity = req.body.quantity

    res.sendFile(path.join(__dirname + '/../uploads/products/' + req.file.filename))

    product.save()
        .then((res) => {
            res.redirect('home')
        })
        .catch((err) => {
            console.log(err)
        })

})





module.exports = router