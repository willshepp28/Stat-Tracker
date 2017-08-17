const express = require('express');
const router = express.Router();
const moment = require('moment');
const User = require('../models/user');
const Activity = require('../models/activities');




// login
router.route('/')
    .get(function (request, response) {

        
        response.render('signin');
    })
    .post(function (request, response) {

        // get username and password
        const username = request.body.username;
        const password = request.body.password;

        var user = User.findOne({ username: username, password: password })
            .then(function (e) {
                request.session.username = username;
                request.session.isAuthenticated = true;
                request.session._userid = e.id;
              
                console.log(request.session);
                // res.redirect('/api/activities');
                // res.json('/api/activities');
                response.json({status:"success", message: "succesfully logged in"});
            })
            .catch(function (e) {
                console.log(e);
                console.log('error');
                response.json({status: "failure", message: "Error, wrong email or password"});
            });

       
    });


// signup
router.route('/signup')
    .get(function (request, response) {
        res.render('signup');
    })


    .post(function (request, response) {

        // get username and password
        const username = request.body.username;
        const password = request.body.password;
        const confirm = request.body.confirm;
        const time = moment().format("dddd, MMMM Do YYYY, h:mm:ss a");

        if (password === confirm) {


            // create a user
            User.create({ username: username, dateJoined: time, password: password })
                .then(function (e) {
                    console.log(e);
                    response.json({status: "success", message: "you successfully signed up"})
                })
                .catch(function (e) {
                    console.log(e);
                    response.json({status: "failure", message: "Error. You did not sign up"})
                });

        } else {
            res.redirect('/signup');
        }

    });


    router.get('/logout', function(request, response){
        request.session.destroy();
        response.json({status:"success", message: "you have successfully signed out"});
    })

module.exports = router;