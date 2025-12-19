const db = require('../config/db');

class User {
    static async create(username, email, passwordHash) {
        const sql = 'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)';
        const [result] = await db.execute(sql, [username, email, passwordHash]);
        return result.insertId;
    }

    static async findByEmail(email) {
        const sql = 'SELECT * FROM users WHERE email = ?';
        const [rows] = await db.execute(sql, [email]);
        return rows[0];
    }
}

module.exports = User;