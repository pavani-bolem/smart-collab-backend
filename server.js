const express = require('express');
const app = express();
app.use(express.json()); // Allows us to read JSON from the body
const PORT = process.env.PORT || 3000;

const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

const taskRoutes = require('./routes/taskRoutes');
app.use('/api/tasks', taskRoutes);

app.get('/', (req, res) => {
    res.send('Smart Collab API is Running!');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});