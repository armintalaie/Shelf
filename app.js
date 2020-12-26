const port = 8081
const fs = require('fs')
const mongoose = require('mongoose')
const express = require('express')
var path = require('path');
var bodyParser = require('body-parser')
var multer = require('multer');
const productRoutes = require('./routes/productRoutes')
const userRoutes = require('./routes/userRoutes')
const passport = require('passport');
require("./config/passport")(passport)

//var router = exp.Router()
const app = express()

// connect to mongodb
const dbURI = 'mongodb+srv://userAr:armin1234@cluster0.uc5fp.mongodb.net/Shelf?retryWrites=true&w=majority'
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((result) => console.log("connected to db"))
    .catch((err) => console.log(err))


app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.set('views', __dirname + '/public/views')
app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }))







// serve the homepage
app.get('/home', (req, res) => {
    res.render('index')

})






// create product
app.get('/user/signin', (req, res) => {
    res.render('user/signin')

})


app.use(productRoutes)
app.use(userRoutes)

// any other address
/*app.use((req, res) => {
    res.render('index') //res.status(404).render(404)
})*/



app.listen(8081, () => {
    console.log('listening on 8081' + __dirname + '/public/index.html')
})