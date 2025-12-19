const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

// POST /api/auth/register
router.post('/register', authController.register);

// POST /api/auth/login
router.post('/login', authController.login); 

// GET /api/auth/profile (Protected Route)
router.get('/profile', authMiddleware, (req, res) => {
    // If they get here, the middleware already verified them!
    res.json({ 
        message: 'This is a protected route', 
        user: req.user // This will show the ID and Email from the token
    });
});

module.exports = router;