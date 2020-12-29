const express = require('express')
const router = express.Router()
const User = require('../models/user')
var bodyParser = require('body-parser')
var multer = require('multer')
const fs = require('fs')
const mongoose = require('mongoose')
const passport = require('passport')
const session = require('express-session');
const bcrypt = require('bcrypt');
var mongo = require('mongodb')
var MongoClient = require('mongodb').MongoClient;


const dbURI = 'mongodb+srv://userAr:armin1234@cluster0.uc5fp.mongodb.net/Shelf?retryWrites=true&w=majority'
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((result) => console.log("connected to db"))
    .catch((err) => console.log(err))


router.use((req, res, next) => {
    res.locals.name = "aa";
    next();
});

// serve the homepage
router.get('/user/signin', (req, res) => {
    res.render('user/signin')

})

var dab

MongoClient.connect(dbURI, {
    useNewUrlParser: true
}, function(err, db) {
    if (err) throw err;
    dab = db.db('Shelf')
});



router.get('/data', function(req, res, next) {
    /*mongo.connect(dbURI, function(err, cl) {
        console.log('The insertDocuments db is typeof: ' + typeof cl)
        var cursor = cl.db('users')
        console.log('The insertDocuments db is typeof: ' + typeof cursor)
        cursor.collection('products').find().toArray(function(err, resu) {
            console.log(resu)
        })
    })*/
    MongoClient.connect(dbURI, function(err, db) {
        if (err) { return console.dir(err); }
        var collection = db.db('Shelf');

        collection.collection('products').find().toArray(function(err, resu) {
            resu.forEach(element => {
                console.log(element.name)
            });
        })
    })



})





// serve the homepage
router.get('/user/signup', (req, res) => {
    res.render('user/signup')

})


router.post('/user/signup', (req, res) => {
    const { name, email, password, password2 } = req.body;
    let errors = [];
    console.log(' Name ' + name + ' email :' + email + ' pass:' + password);
    if (!name || !email || !password || !password2) {
        errors.push({ msg: "Please fill in all fields" })
    }
    //check if match
    if (password !== password2) {
        errors.push({ msg: "passwords dont match" });
    }

    //check if password is more than 6 characters
    if (password.length < 6) {
        errors.push({ msg: 'password atleast 6 characters' })
    }
    if (errors.length > 0) {
        res.render('user/signup', {
            errors: errors,
            name: name,
            email: email,
            password: password,
            password2: password2
        })
    } else {
        //validation passed
        User.findOne({ email: email }).exec((err, user) => {
            console.log(user);
            if (user) {
                errors.push({ msg: 'email already registered' });
                render(res, errors, name, email, password, password2);

            } else {
                const newUser = new User({
                    name: name,
                    email: email,
                    password: password
                });

                //hash password
                bcrypt.genSalt(10, (err, salt) =>
                    bcrypt.hash(newUser.password, salt,
                        (err, hash) => {
                            if (err) throw err;
                            //save pass to hash
                            newUser.password = hash;
                            //save user
                            newUser.save()
                                .then((value) => {
                                    console.log(value)
                                    res.render('index');
                                })
                                .catch(value => console.log(value));

                        }));
            }
        })
    }
})


router.post('/user/signin',
    //console.log(req.body)

    passport.authenticate('local', {
        successRedirect: '/user/myshelf',
        failureRedirect: '/signout',
    })
)

router.get('/user/myshelf', (req, res, next) => {
    if (!req.user)
        res.redirect('signin')

    dab.collection('products').find({ user_id: req.user._id }).toArray(function(err, resu) {
        res.locals.products = resu
        res.locals.user = req.user
        res.render('myshelf')
    })

})

router.get('/user/signout', (req, res) => {
    req.logout();
    res.redirect('signin');

})



module.exports = router