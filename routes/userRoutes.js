const express = require('express')
const router = express.Router()
const User = require('../models/user')
var bodyParser = require('body-parser')
var multer = require('multer')
const fs = require('fs')
const mongoose = require('mongoose')
const { use } = require('passport')




const dbURI = 'mongodb+srv://userAr:armin1234@cluster0.uc5fp.mongodb.net/Shelf?retryWrites=true&w=majority'
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((result) => console.log("connected to db"))
    .catch((err) => console.log(err))




// serve the homepage
router.get('/user/signup', (req, res) => {
    res.render('user/signup')

})


router.post('/user/signup', (req, res) => {


    console.log(req.body)

    var user = new User
    user.name = req.body.name
    user.email = req.body.email
    user.password = req.body.password


    user.save()
        .then((res1) => {
            res.render('index')
        })
        .catch((err) => {
            console.log(err)
        })

})


module.exports = router