const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const authMiddleware = require('../middleware/authMiddleware');

// All routes here are protected by the "Guard" (authMiddleware)
router.use(authMiddleware);

// POST /api/tasks -> Create
router.post('/', taskController.createTask);

// GET /api/tasks -> Read All
router.get('/', taskController.getTasks);

// PUT /api/tasks/:id -> Update (e.g., /api/tasks/1)
router.put('/:id', taskController.updateTask);

// DELETE /api/tasks/:id -> Delete
router.delete('/:id', taskController.deleteTask);

module.exports = router;