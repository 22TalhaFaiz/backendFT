const p = require("../Controller/Crud");
const exp = require("express");
const { verifyToken } = require("../Middleware/authMiddleware"); // JWT middleware
const router = exp.Router();

// ✅ Register and Login
router.post("/r", p.create);
router.post("/l", p.login);

// ✅ Protected routes
router.get("/dashboard", verifyToken, (req, res) => {
    // req.user comes from JWT middleware
    res.json({ message: `Welcome ${req.user.name}!` });
});

router.get("/me", verifyToken, (req, res) => {
    res.json({ user: req.user });
});

// ✅ Logout for JWT: instruct client to remove token
router.post("/logout", (req, res) => {
    // On JWT, logout is handled client-side by deleting the token
    res.json({ message: "Logged Out Successfully. Please remove token from client." });
});

module.exports = router;
