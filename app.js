const port = 3000
const fs = require('fs')
const mongoose = require('mongoose')
const express = require('express')
var bodyParser = require('body-parser')
const productRoutes = require('./routes/productRoutes')
const userRoutes = require('./routes/userRoutes')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session);
const passport = require('passport')
require("./config/passport")(passport)
var MongoClient = require('mongodb').MongoClient
const dbURI // databse link 
var mydb

//var router = exp.Router()
const app = express()

// connect to mongodb
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((result) => console.log("connected to db"))
    .catch((err) => console.log(err))


// fetch the database
MongoClient.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true }, function(err, db) {
    if (err) {
        console.log('failed to connect ' + err)
    } else {
        mydb = db.db('Shelf')
    }
})
const connection = mongoose.createConnection(dbURI, { useNewUrlParser: true, useUnifiedTopology: true });

// make databse accessible for all routes
app.all('*', function(req, res, next) {
    console.log('database connected')
    req.mydb = mydb
    next()
})

// set up web app setting
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
        if (err) {
            console.log('Unable to connect to the mongoDB server. Error:', err)
        } else {
            res.locals.products = resu
            res.locals.user = req.user
            res.render('index')
        }
    })
})

app.get('/', (req, res) => {
    res.redirect('home')
})

// serve the guide
app.get('/guide', (req, res) => {
    res.locals.user = req.user
    res.render('guide')

})

// routers
app.use(productRoutes)
app.use(userRoutes)


// listen to port
app.listen((process.env.PORT || port), () => {
    console.log('listening')
})
