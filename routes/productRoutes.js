const express = require('express')
const router = express.Router()
const Product = require('../models/product')
var bodyParser = require('body-parser')
var multer = require('multer')
const fs = require('fs')
const mongoose = require('mongoose')
var path = require('path')
const passport = require('passport')
require("../config/passport")(passport)
const dbURI = 'mongodb+srv://userAr:armin1234@cluster0.uc5fp.mongodb.net/Shelf?retryWrites=true&w=majority'


// setting storage for image uploads
storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, __dirname + '/../uploads/products')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
})
var upload = multer({ storage: storage })


/** get products based on request
 * if user signed in gets user's products and calls callback
 * if not signed in it fetches the public photos and call call back
 */
function getProducts(user, dst, res, db, callback) {
    console.log("getting products")
    if (user) {

        db.collection('products').find({ user_id: user._id }).toArray(function(err, results) {
            callback(user, dst, res, results)
        })
    } else {
        db.collection('products').find({ public: true }).toArray(function(err, results) {
            callback(user, dst, res, results)
        })
    }
}

/** perform operation on a single product based on request
 * if action is remove, remove product and serve 'myshelf'
 * if action is view, renders the 'product' view
 * if action is update, renders the 'productUpdate' view
 */
function singleProduct(user, id, action, res, db, callback) {
    switch (action) {
        case 'remove':
            Product.findByIdAndRemove(id, function(err, results) {
                getProducts(user, 'myshelf', res, callback)
            }).lean()
            break
        case 'view':
            Product.findById(id, function(err, results) {
                callback(user, 'product', res, results)
            })
            break
        case 'update':
            Product.findById(id, function(err, results) {
                callback(user, 'productUpdate', res, results)
            })
            break
        default:
            console.log('def')
            return
    }
}



/**
 * renders dst view and assigns its params (results,user)
 */
function renderView(user, dst, res, results) {
    if (dst == 'myshelf' || dst == 'index') {
        res.locals.products = results
    } else {
        res.locals.product = results
    }
    res.locals.user = user
    res.render(dst)
}


// search the product databse for public images matching the search 
//and render the home feed with results
router.post('/products/search', (req, res) => {
    search = req.body.search
    req.mydb.collection('products').find({ name: { $regex: ".*" + search + ".*" }, public: true }).toArray(function(err, results) {
        res.locals.products = results
        res.locals.user = req.user
        res.render('index')
    })
})


// serve the add a product page for user
router.get('/product/create', (req, res) => {
    res.locals.user = req.user
    res.render('post')

})


/**
 * create product with info submitted by user (name,price,quantity,image)
 * uploads image and the product to the mongodb databse
 * loads user's inventory
 */
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
            getProducts(req.user, 'myshelf', resp, req.mydb, renderView)
        })
        .catch((err) => {
            console.log(err)
        })
})

// serve the product page for product with id =  :id
router.get('/products/:id', (req, res) => {
    singleProduct(req.user, req.params.id, 'view', res, req.mydb, renderView)
})

// remove the product with id =  :id
router.get('/products/remove/:id', (req, res) => {
    singleProduct(req.user, req.params.id, 'remove', res, req.mydb, renderView)
})

// serve the prodcutUpdate view for the product with id =  :id
router.get('/products/update/:id', (req, res) => {
    singleProduct(req.user, req.params.id, 'update', res, req.mydb, renderView)
})


// process request to update suer's product 
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
        getProducts(req.user, 'myshelf', res, req.mydb, renderView)
    })
})

// serve the inventory for user
router.get('/products/myshelf', (req, res) => {
    getProducts(req.user, 'myshelf', res, req.mydb, renderView)
})


module.exports = router