const port = 8081
const fs = require('fs')
const mongoose = require('mongoose')
const express = require('express')
var path = require('path');
var bodyParser = require('body-parser')
var multer = require('multer');
const productRoutes = require('./routes/productRoutes')
const userRoutes = require('./routes/userRoutes')
const session = require('express-session');
const passport = require('passport');
require("./config/passport")(passport)
var mongo = require('mongodb')
var MongoClient = require('mongodb').MongoClient;

var db

const dbURI = 'mongodb+srv://userAr:armin1234@cluster0.uc5fp.mongodb.net/Shelf?retryWrites=true&w=majority'


//exports.db = db;



//var router = exp.Router()
const app = express()

// connect to mongodb
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((result) => console.log("connected to db"))
    .catch((err) => console.log(err))

MongoClient.connect(dbURI, { useNewUrlParser: true })
    .then(client => {
        const dbo = client.db('Shelf');
        app.locals.dbo = dbo; // this line stores the collection from above so it is available anywhere in the app, after small delay.
    }).catch(error => console.error(error));


app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}))

app.use((req, res, next) => {
    app.locals.name = "aa";
    next();
});
app.use(passport.initialize());
app.use(passport.session());

app.set('views', __dirname + '/public/views')
app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }))







// serve the homepage
app.get('/home', (req, res) => {
    res.locals.user = req.user
    MongoClient.connect(dbURI, function(err, db) {
        if (err) { return console.dir(err); }
        var collection = db.db('Shelf');

        collection.collection('products').find({ public: true }).toArray(function(err, resu) {
            res.locals.products = resu
            res.locals.user = req.user
            res.render('index')
        })

    })



})

app.get('/', (req, res) => {
    res.locals.user = req.user
    res.render('index')

})

app.get('/guide', (req, res) => {
    res.locals.user = req.user
    res.render('guide')

})






// create product
app.get('/user/signin', (req, res) => {
    res.render('user/signin')

})
app.use(function(req, res, next) {
    req.db = db;
    next();
});


app.use(productRoutes)
app.use(userRoutes)

// any other address
/*app.use((req, res) => {
    res.render('index') //res.status(404).render(404)
})*/




app.listen(8081, () => {
    console.log('listening on 8081' + __dirname + '/public/index.html')
})