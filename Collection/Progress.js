const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    weight: {
        type: Number, // in kg
        required: true
    },
    bodyMeasurements: {
        chest: { type: Number, default: 0 },
        waist: { type: Number, default: 0 },
        hips: { type: Number, default: 0 },
        arms: { type: Number, default: 0 },
        legs: { type: Number, default: 0 },
    },
    performanceMetrics: {
        runTime: { type: Number, default: 0 }, // e.g., 5km run in minutes
        liftingMax: { type: Number, default: 0 }, // max weight lifted
        other: { type: String, default: '' }
    }
});

module.exports = mongoose.model('Progress', progressSchema);
