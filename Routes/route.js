const p = require("../Controller/Crud");
const exp = require("express");
const isAuthenticated = require("../Middleware/authMiddleware");
const { createWorkout } = require("../Controller/WorkoutController");
const router = exp.Router();

router.post("/r", p.create)
router.post("/l", p.login)

router.get("/dashboard", isAuthenticated, (req, res) => {
    res.json({ message: `Welcome ${req.session.user.name}!` });
})

router.get("/me", isAuthenticated, (req, res) => {
  res.json({ user: req.session.user });
});

router.post("/logout", (req, res) => {
    req.session.destroy(err => {
        if (err) return res.status(500).json({ message: "Logout Failed" });
        res.clearCookie("connect.sid");
        res.json({ message: "Logged Out Succesfully" })
    })
})








module.exports = router


