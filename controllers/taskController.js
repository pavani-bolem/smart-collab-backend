const axios = require('axios');
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
                const aiResponse = await axios.post('http://localhost:5000/predict', {
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
        const affectedRows = await Task.update(id, req.body);
        
        if (affectedRows === 0) return res.status(404).json({ message: 'Task not found' });
        
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