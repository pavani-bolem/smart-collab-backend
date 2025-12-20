const db = require('../config/db');

class Task {
    static async create(title, description, status, priority, userId) {
        const sql = 'INSERT INTO tasks (title, description, status, priority, assigned_to) VALUES (?, ?, ?, ?, ?)';
        const [result] = await db.execute(sql, [title, description, status, priority, userId]);
        return result.insertId;
    }

    static async findAllByUser(userId) {
        const sql = 'SELECT * FROM tasks WHERE assigned_to = ? ORDER BY created_at DESC';
        const [rows] = await db.execute(sql, [userId]);
        return rows;
    }

    static async update(taskId, updates) {
        // Dynamic SQL generation (Only update fields that are sent)
        const keys = Object.keys(updates);
        const values = Object.values(updates);
        
        if (keys.length === 0) return 0; // Nothing to update

        const setClause = keys.map(key => `${key} = ?`).join(', ');
        const sql = `UPDATE tasks SET ${setClause} WHERE id = ?`;
        
        // Add taskId to the end of the values array for the WHERE clause
        values.push(taskId);

        const [result] = await db.execute(sql, values);
        return result.affectedRows;
    }

    static async delete(taskId) {
        const sql = 'DELETE FROM tasks WHERE id = ?';
        const [result] = await db.execute(sql, [taskId]);
        return result.affectedRows;
    }
}

module.exports = Task;