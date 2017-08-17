// models/activites.js
const mongoose = require('mongoose');
const User = require('./user');

const activitySchema = new mongoose.Schema({
    _creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: { type: String, required: true, unique: true },
    date: { type: String, required: true },
    description: { type: String, required: true },
    activityTracking: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'Stat' }
    ],
});

const Activity = mongoose.model('Activity', activitySchema);

module.exports = Activity;

