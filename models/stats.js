// models/activites.js
const mongoose = require('mongoose');
const User = require('./user');

const statsSchema = new mongoose.Schema({
    _activityId: { type: mongoose.Schema.Types.ObjectId, ref: 'Activity' },
    date: { type: String, required: true },
    timeSpent: { type: String, required: true }
});

const Stat = mongoose.model('Stat', statsSchema);

module.exports = Stat;
