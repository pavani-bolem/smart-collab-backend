const path = require('path');
const express = require('express');
const app = express();

app.use(express.json()); 
const PORT = process.env.PORT || 3000;

// 1. Serve Static Files (CSS, JS, Images)
// This MUST be at the top so files are found first
app.use(express.static(path.join(__dirname, 'public')));

// 2. API Routes
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

const taskRoutes = require('./routes/taskRoutes');
app.use('/api/tasks', taskRoutes);

// 3. The "Catch-All" Route
// If the request is not an API call and not a static file, serve the HTML
// (This enables the Single Page Application logic)
app.get(/(.*)/, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});