const axios = require('axios');
const db = require('../config/db');
const Task = require('../models/Task');

// 1. Create a new Task
exports.createTask = async (req, res) => {
    try {
        const { 
            title, 
            description = null, 
            status = 'todo', 
            priority  // We removed the default value here to check if user sent it
        } = req.body;

        const userId = req.user.id; 

        if (!title) return res.status(400).json({ message: 'Title is required' });

        // --- AI INTEGRATION START ---
        // If user didn't provide a priority, let AI decide based on description
        let finalPriority = priority || 'medium'; // Default to medium if AI fails

        if (!priority && description) {
            try {
                // Call the Python Microservice
                const aiResponse = await axios.post(`${AI_URL}/predict`, {
                    description: description
                });

                // If AI gives a priority, use it!
                if (aiResponse.data.priority) {
                    finalPriority = aiResponse.data.priority;
                    console.log(`🤖 AI decided priority: ${finalPriority}`);
                }
            } catch (error) {
                console.error("⚠️ AI Service is offline. Using default priority.");
                // We don't crash the app; we just use the default 'medium'
            }
        }
        // --- AI INTEGRATION END ---

        const taskId = await Task.create(title, description, status, finalPriority, userId);

        // Return the AI's decision to the user so they can see the magic
        res.status(201).json({ 
            message: 'Task created', 
            taskId, 
            priority: finalPriority 
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// 2. Get All Tasks for Logged In User
exports.getTasks = async (req, res) => {
    try {
        const userId = req.user.id;
        const tasks = await Task.findAllByUser(userId);
        res.json(tasks);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// 3. Update a Task
exports.updateTask = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const { title, description, status } = req.body;

        // --- NEW: VALIDATION CHECK ---
        // If user sent a status, make sure it is one of the allowed words
        const validStatuses = ['todo', 'in_progress', 'done'];
        if (status && !validStatuses.includes(status)) {
            return res.status(400).json({ 
                message: 'Invalid status. Allowed values: todo, in_progress, done' 
            });
        }
        // -----------------------------

        // 1. Get Existing Task
        const [tasks] = await db.execute('SELECT * FROM tasks WHERE id = ? AND assigned_to = ?', [id, userId]);

        if (tasks.length === 0) {
            return res.status(404).json({ message: 'Task not found' });
        }

        const existingTask = tasks[0];

        // 2. Prepare Values
        let newTitle = title || existingTask.title;
        let newDescription = description || existingTask.description;
        let newStatus = status || existingTask.status;
        let newPriority = existingTask.priority; 

        // 3. AI Check
        if (description && description !== existingTask.description) {
            try {
                const aiResponse = await axios.post(`${AI_URL}/predict`, { description: newDescription });
                if (aiResponse.data.priority) newPriority = aiResponse.data.priority;
            } catch (error) {
                console.log("AI Service offline.");
            }
        }

        // 4. Update Database
        const updateQuery = `UPDATE tasks SET title=?, description=?, status=?, priority=? WHERE id=? AND assigned_to=?`;
        await db.execute(updateQuery, [newTitle, newDescription, newStatus, newPriority, id, userId]);

        res.json({ message: 'Task updated successfully' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// 4. Delete a Task
exports.deleteTask = async (req, res) => {
    try {
        const { id } = req.params;
        const affectedRows = await Task.delete(id);

        if (affectedRows === 0) return res.status(404).json({ message: 'Task not found' });

        res.json({ message: 'Task deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};