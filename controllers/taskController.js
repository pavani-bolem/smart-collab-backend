const Task = require('../models/Task');

// 1. Create a new Task
exports.createTask = async (req, res) => {
    try {
        // FIX: Add default values (= null) to prevent "undefined" errors
        const { 
            title, 
            description = null,   // If missing, use null
            status = 'todo',      // If missing, use 'todo'
            priority = 'medium'   // If missing, use 'medium'
        } = req.body;

        const userId = req.user.id; 

        if (!title) return res.status(400).json({ message: 'Title is required' });

        // Now these variables are guaranteed to be safe for MySQL
        const taskId = await Task.create(title, description, status, priority, userId);
        
        res.status(201).json({ message: 'Task created', taskId });
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