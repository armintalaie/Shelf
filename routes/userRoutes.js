const express = require('express')
const router = express.Router()
const User = require('../models/user')
const fs = require('fs')
const passport = require('passport')
const session = require('express-session');
const bcrypt = require('bcrypt');



// serve the signin page
router.get('/user/signin', (req, res) => {
    res.render('user/signin')

})


// serve the signun page
router.get('/user/signup', (req, res) => {
    res.render('user/signup')

})


/**  sign up user with information posted
 *   hash password of user
 *   save user info on mongodb server
 */
router.post('/user/signup', (req, res) => {
    const { name, email, password, password2 } = req.body
    let errors = []
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
                                    res.redirect('signin');
                                })
                                .catch(value => console.log(value));

                        }));
            }
        })
    }
})


/**  authenticate user signin
 *   if successful user's myshelf is loaded
 *   if unsuccessful signin page is loaded again
 */
router.post('/user/signin',
    passport.authenticate('local', {
        successRedirect: '/user/myshelf',
        failureRedirect: '/user/signin',
    })
)

// serve user's inventory if signed in otherwise serves the signin page
router.get('/user/myshelf', (req, res, next) => {
    if (!req.user)
        res.redirect('signin')

    req.mydb.collection('products').find({ user_id: req.user._id }).toArray(function(err, resu) {
        res.locals.products = resu
        res.locals.user = req.user
        res.render('myshelf')
    })

})

// sign out user and remove session
router.get('/user/signout', (req, res) => {
    req.logout();
    res.redirect('signin');
})



module.exports = router