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
const { db } = require('../models/product')
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

var dab

MongoClient.connect(dbURI, {
    useNewUrlParser: true
}, function(err, db) {
    if (err) throw err;
    dab = db.db('Shelf')
});



function getProducts(user, dst, res, callback) {
    console.log("getting products")
    if (user) {

        dab.collection('products').find({ user_id: user._id }).toArray(function(err, results) {
            callback(user, dst, res, results)
        })
    } else {
        dab.collection('products').find({ public: true }).toArray(function(err, results) {
            callback(user, dst, res, results)
        })
    }
}

function singleProduct(user, id, action, res, callback) {
    switch (action) {
        case 'remove':
            console.log('rem')
            Product.findByIdAndRemove(id, function(err, results) {
                getProducts(user, 'myshelf', res, callback)
            }).lean()
            break
        case 'view':
            console.log('find')
            Product.findById(id, function(err, results) {
                callback(user, 'product', res, results)
            })
            break
        case 'update':
            console.log('up')
            Product.findById(id, function(err, results) {
                callback(user, 'productUpdate', res, results)
            })
            break
        default:
            console.log('def')
            return
    }
}

function renderView(user, dst, res, results) {
    if (dst == 'myshelf' || dst == 'index') {
        res.locals.products = results
    } else {
        res.locals.product = results
    }
    res.locals.user = user
    res.render(dst)

}



router.get('/products/create', (req, res) => {
    res.locals.user = req.user
    res.render('create')
})

router.get('/products/create', (req, res) => {
    res.locals.user = req.user
    res.render('create')
})



router.post('/products/search', (req, res) => {
    search = req.body.search
    dab.collection('products').find({ name: { $regex: ".*" + search + ".*" }, public: true }).toArray(function(err, results) {
        res.locals.products = results
        res.locals.user = req.user
        res.render('index')
    })
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
    var product = new Product;
    product.img = {
        data: fs.readFileSync(path.join(__dirname + '/../uploads/products/' + req.file.filename)),
        contentType: 'image/png'
    }
    product.name = req.body.name
    product.price = req.body.price
    product.quantity = req.body.quantity

    let checkedValue = req.body.public
    if (checkedValue) {
        product.public = true
    } else {
        product.public = false
    }
    product.user_id = req.user._id
    req.user.products.push(product._id)

    product.save()
        .then((res) => {
            getProducts(req.user, 'myshelf', res, renderView)
        })
        .catch((err) => {
            console.log(err)
        })

})

router.get('/products/:id', (req, res) => {
    singleProduct(req.user, req.params.id, 'view', res, renderView)

})

router.get('/products/remove/:id', (req, res) => {
    singleProduct(req.user, req.params.id, 'remove', res, renderView)

})


router.get('/products/update/:id', (req, res) => {
    singleProduct(req.user, req.params.id, 'update', res, renderView)

})

router.post('/products/update/:id', (req, res) => {

    checkedValue = false
    if (req.body.public) {
        checkedValue = true
    }
    Product.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        price: req.body.price,
        quantity: req.body.quantity,
        public: checkedValue
    }, function(err, result) {
        getProducts(req.user, 'myshelf', res, renderView)
    })

})


router.get('/products/myshelf', (req, res) => {
    getProducts(req.user, 'myshelf', res, renderView)

})


module.exports = router