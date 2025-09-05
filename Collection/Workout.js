const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema({
    name : {
        type:String,
        required:true,
        trim:true
    },
    sets:{
        type:Number,
        required:true
    },
     reps:{
        type:Number,
        required:true
    },
    weight:{
        type:Number,
        default:0,
    },
    notes:{
        type:String,
        trim:true
    }

    

})

const workoutSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'users',
        required:true
    },
    title:{
        type:String,
        required:true,
        trim:true
    },
    type:{
        type:String,
        enum:['Cardio','Strength','Flexibility','HIIT','Other'],
        default:'Strength'
    },
    duration:{
        type:Number,
        default:0
    },
    caloriesBurned:{
        type:Number,
        default:0
    },
    exercises:[exerciseSchema],
    date:{
        type:Date,
        default:Date.now
    }

})

module.exports = mongoose.model('Workout', workoutSchema);