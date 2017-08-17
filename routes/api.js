const express = require('express');
const router = express.Router();
const moment = require('moment');
const User = require('../models/user');
const Activity = require('../models/activities');
const Stat = require('../models/stats');


// if user is not authenticated send back to login 
router.use(function (request, response, next) {
    if (request.session.isAuthenticated === false) {
        // response.redirect('/');
        response.json({ status: 'failure', message: 'you need to sign in to see this page'});
    } else {
        next();
    }
});



// GET 	/activities 	Show a list of all activities I am tracking, and links to their individual pages
router.route('/activities')
    .get( function (request, response) {


        var activity = Activity.find()
            .populate('activityTracking')
            .exec((err, activities) => {
                return response.json(activities)
            })
            .catch(function (e) {
                console.log(e);
                // res.render('activities', { activity: e });
                return response.json({activities:e})
            })

    })
    .post(function (request, response) {

        // get username and _userid
        const name = request.body.name;
        const username = request.session.username;
        const userid = request.session._userid;
        const description = request.body.description;
        const time = Date.now();



        // create a user


        Activity.create({ _creator: userid, name: name, description: description, date: time })
            .then(function (e) {
                console.log(e);

                User.update({ id: userid }, { $push: { activities: e._id } });
                // response.redirect('/')
                response.json({status: "success", message: "you created a new activity"});
            })
            .catch(function (e) {
                console.log(e);
                // response.redirect('/signup');
                response.json({status: "failure", message: "you did not create a new activity"});
            });



    });




router.route('/activities/:id')
    .get(function (request, response) {

        const id = request.params.id;

        var activity = Activity.findOne({ _id: id })
            .then(function (e) {

                console.log(request.session);
                // res.render('activity', { activity: e });
                response.json({status: "success", activity: e});
            })
            .catch(function (e) {
                console.log(e);
                console.log('error');
                // response.redirect('/');
                response.json({status: "failure", message: "cannot get activity"});
            });

    })
    .put(function (request, response) {

     // PUT 	/activities/{id} 	Update one activity I am tracking, changing attributes such as name or type. Does not allow for changing tracked data.

        // localhost:8000/api/activities/5991f68fbff3ba073c47360c
        const name = request.body.name;
        const id = request.params.id;
        const username = request.session.username;
        const description = request.body.description;
        const date = Date.now();

        Activity.findOneAndUpdate(
            { _id: id },
            {name:name, date: date, description: description}
            )
            .then(function (e) {
                console.log(e);
                response.json({status: "success", message: "you updated this activity"});
            })
            .catch(function (e) {
                console.log(e);
                response.json({status: "failure", message: "Error, you didnt update this activity"})
            })
    })
    .delete(function(request, response){

        const id = request.params.id;

        Activity.findOneAndRemove({ _id:id })
            .then(function(e){
                console.log(e);
                response.json({status:"success", message: "You deleted this activity"});
            })
            .catch(function(e){
                response.json({status: "failure", message: "Error, You didnt delete this message"})
            })
    })





// POST 	/activities/{id}/stats 	Add tracked data for a day. The data sent with this should include the day tracked. You can also override the data for a day already recorded.
router.route('/activities/:id/stats')
    .post(function(request, response){

        const id = request.params.id;
        const date = Date.now()
        const timeSpent = request.body.timeSpent;
        

            // create a user
            Stat.create({ date: date, timeSpent: timeSpent })

            .then(function (stat) {

                console.log(stat);
                Activity.findById(id)
                    .then(function (activity) {
                        activity.activityTracking.push(stat)
                        activity.save((err, newActivity) => {
                            console.log(newActivity)
                            return response.json(newActivity);
                            
                        })
                    })
                    .catch(function (e) {
                        console.log(e);
                        return response.json({status: "failure", message: "Error, you didnt update this activity"})
                    })
            })
            .catch(function (e) {
                console.log(e);
                response.json({status: "failure", message: "Error. You did not create any tracked data"})
            });


       
    })



    // Remove tracked data for a day.
    router.delete('/stats/:id',function(request, response){

        const id = request.params.id;

        Stat.deleteOne({_id: id})
            .then(function(e){
                return response.json({status: "success", message: "You successfully deleted one stat"});
            })
            .catch(function(e){
                console.log(e);
                return response.json({status: "failuer", message: "Error, you failed to delete on stat"});
            })
    })
   


    




module.exports = router;