const mongoose = require('mongoose')
const express = require('express')
var path = require('path');
var bodyParser = require('body-parser')
const session = require('express-session');
var mongo = require('mongodb')
var MongoClient = require('mongodb').MongoClient;



MongoClient.connect(url, {
    useNewUrlParser: true
}, callback, function(err, db) {
    if (err) throw err;
    global.dbo = db.db('testdb');
});