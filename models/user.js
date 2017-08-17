// models/recipe.js
const mongoose = require('mongoose')
  , Schema = mongoose.Schema

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    dateJoined: { type: String, required: true, unique: true },
    password: { type: String, required: true, unique: true },
    activities: [{type: mongoose.Schema.ObjectId, ref: "Activity"}],
   
});

const User = mongoose.model('User', userSchema );

module.exports = User;


// activity.create()
// user.activities.push(  )