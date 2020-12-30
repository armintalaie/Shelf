const port = 8081
const fs = require('fs')
const mongoose = require('mongoose')
const express = require('express')
var path = require('path')
var bodyParser = require('body-parser')
var multer = require('multer')
const productRoutes = require('./routes/productRoutes')
const userRoutes = require('./routes/userRoutes')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session);
const passport = require('passport')
require("./config/passport")(passport)
var mongo = require('mongodb')
var MongoClient = require('mongodb').MongoClient

var mydb
const dbURI = 'mongodb+srv://userAr:armin1234@cluster0.uc5fp.mongodb.net/Shelf?retryWrites=true&w=majority'

//var router = exp.Router()
const app = express()

// connect to mongodb
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((result) => console.log("connected to db"))
    .catch((err) => console.log(err))

MongoClient.connect(dbURI, {
    useNewUrlParser: true
}, function(err, db) {
    if (err) throw err;
    mydb = db.db('Shelf')

})


const connection = mongoose.createConnection(dbURI, { useNewUrlParser: true, useUnifiedTopology: true });


app.all('*', function(request, response, next) {
    console.log('database connected')
    request.mydb = mydb
    next()
})

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
    store: new MongoStore({ mongooseConnection: connection })
}))

app.use(passport.initialize())
app.use(passport.session())

app.set('views', __dirname + '/public/views')
app.set('view engine', 'ejs')

app.use(express.static(__dirname + '/public'))
app.use(express.urlencoded({ extended: true }))



// serve the homepage
app.get('/home', (req, res) => {
    res.locals.user = req.user
    mydb.collection('products').find({ public: true }).toArray(function(err, resu) {
        res.locals.products = resu
        res.locals.user = req.user
        res.render('index')
    })
})

app.get('/', (req, res) => {
    if (req.user)
        res.locals.user = req.user
    mydb.collection('products').find({ public: true }).toArray(function(err, resu) {
        res.locals.products = resu
        res.locals.user = req.user
        res('index')
    })

})

app.get('/guide', (req, res) => {
    res.locals.user = req.user
    res.render('guide')

})

app.get('/user/signin', (req, res) => {
    res.render('user/signin')

})
app.use(function(req, res, next) {
    req.db = mydb;
    next();
})


app.use(productRoutes)
app.use(userRoutes)



app.listen(process.env.PORT || port, () => {
    console.log('listening on 8081' + __dirname + '/public/index.html')
})