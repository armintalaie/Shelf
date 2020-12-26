const port = 3000
const fs = require('fs')
const mongoose = require('mongoose')
const express = require('express')
var path = require('path');
const Product = require('./models/product')
var bodyParser = require('body-parser')
var multer = require('multer');

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



var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, __dirname + '/uploads')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
});

var upload = multer({ storage: storage });



app.get('/products/create', (req, res) => {
    res.render('create')
})



// serve the homepage
app.get('/', (req, res) => {
    res.render('index')

})

app.get('/b', (req, res) => {
    res.render('post')

})


// creating new product
app.post('/products', upload.single('image'), (req, res, next) => {

    if (!req.file) {
        console.log("No file received");
    }

    console.log('hello')
    var product = new Product;
    product.img = {
        data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
        contentType: 'image/png'
    }
    product.name = 'aa'
    product.price = 1
    product.quantity = 1
    res.sendFile(path.join(__dirname + '/uploads/' + req.file.filename))

    product.save()
        .then((res) => {
            res.redirect('index')
        })
        .catch((err) => {
            console.log(err)
        })

})





app.use((req, res) => {
    res.render('hell') //res.status(404).render(404)
})


app.listen(8081, () => {
    console.log('listening on 8081' + __dirname + '/public/index.html')
})