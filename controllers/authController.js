const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // 1. Check if user already exists
        const existingUser = await User.findByEmail(email);
        if (existingUser) {
            return res.status(400).json({ message: 'Email already registered' });
        }

        // 2. Hash the password (Security Best Practice)
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        // 3. Save user to database
        const userId = await User.create(username, email, passwordHash);

        // 4. Create a Token (So they are logged in immediately)
        const token = jwt.sign(
            { id: userId, email: email }, 
            process.env.JWT_SECRET || 'supersecretkey', 
            { expiresIn: '1h' }
        );

        res.status(201).json({ message: 'User registered successfully', token });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};


exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Check if user exists
        const user = await User.findByEmail(email);
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // 2. Validate Password (Compare plain text with Hash)
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // 3. Generate Token (This checks if JWT_SECRET is loaded)
        if (!process.env.JWT_SECRET) {
             throw new Error("JWT_SECRET is missing in .env file");
        }

        const token = jwt.sign(
            { id: user.id, email: user.email }, 
            process.env.JWT_SECRET, 
            { expiresIn: '1h' }
        );

        res.status(200).json({ message: 'Login successful', token });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};