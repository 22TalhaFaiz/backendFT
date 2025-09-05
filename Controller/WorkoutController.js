const Workout = require('../Collection/Workout');

exports.createWorkout = async (req, res) => {
  try {
    if (!req.session || !req.session.user || !req.session.user.id) {
      return res.status(401).json({ message: "Unauthorized: User not found in session" });
    }

    const { title, type, duration, caloriesBurned, exercises } = req.body;
    const userId = req.session.user.id;

    const workout = new Workout({
      userId,
      title,
      type,
      duration,
      caloriesBurned,
      exercises
    });

    await workout.save();
    res.status(201).json({ message: "Workout Created Successfully", workout });
  } catch (error) {
    console.error("Workout creation error:", error.message, error.stack);
    res.status(500).json({ message: "Failed to create Workout", error: error.message });
  }
};

exports.getWorkouts = async (req,res) => {
    try {
        const userId = req.session.user.id;
        const workouts = await Workout.find({userId}).sort({date: -1})
        res.json(workouts);
        
    } catch (error) {
        res.status(500).json({message : 'Failed to Fetch Workouts',error: error.message})
    }
    
}
exports.deleteWorkout = async (req, res) => {
  try {
    const userId = req.session.user.id; // Make sure user is authenticated
    const workoutId = req.params.id;

    const workout = await Workout.findOne({ _id: workoutId, userId });

    if (!workout) {
      return res.status(404).json({ message: 'Workout not found' });
    }

    await workout.deleteOne();
    res.json({ message: 'Workout deleted successfully' });
  } catch (error) {
    console.error('Delete workout error:', error.message);
    res.status(500).json({ message: 'Failed to delete workout', error: error.message });
  }
};