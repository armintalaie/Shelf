const express = require('express')
const router = express.Router()
const Product = require('../models/product')
var bodyParser = require('body-parser')
var multer = require('multer')
const fs = require('fs')
const mongoose = require('mongoose')
var path = require('path')
const passport = require('passport')
const session = require('express-session')
const User = require('../models/user')
require("../config/passport")(passport)

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
    res.locals.user = req.user
    res.render('create')
})



// create product
router.get('/product/create', (req, res) => {
    res.locals.user = req.user
    res.render('post')

})


// creating new product
router.post('/products/create', upload.single('image'), (req, resp, next) => {

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
    console.log(product._id)
    console.log(req.user)
    product.user = req.user._id
    req.user.products.push(product._id)

    us = req.user

    product.save()
        .then((res) => {
            resp.locals.user = req.user
            resp.render('myshelf')
        })
        .catch((err) => {
            console.log(err)
        })

})


router.get('/products/myshelf', (req, res) => {
    res.locals.user = req.user
    res.render('myshelf')

})





module.exports = router