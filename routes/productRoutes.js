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

var mongo = require('mongodb')
var MongoClient = require('mongodb').MongoClient;
const dbURI = 'mongodb+srv://userAr:armin1234@cluster0.uc5fp.mongodb.net/Shelf?retryWrites=true&w=majority'

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
    product.public = false
    console.log(product._id)
    console.log(req.user)
    product.user_id = req.user._id
    req.user.products.push(product._id)

    us = req.user

    product.save()
        .then((res) => {
            resp.locals.user = req.user
            console.log(resp.locals.user)
            resp.render('/user/myshelf')
        })
        .catch((err) => {
            console.log(err)
        })

})


router.get('/products/myshelf', (req, res) => {
    MongoClient.connect(dbURI, function(err, db) {
        if (err) { return console.dir(err); }
        var collection = db.db('Shelf');

        collection.collection('products').find({ user_id: req.user._id }).toArray(function(err, resu) {
            res.locals.products = resu
        })
    })

    res.locals.user = req.user
    res.render('myshelf')

})





module.exports = router