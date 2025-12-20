const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    // ⬇️ THIS IS THE SECRET SAUCE FOR AIVEN/RENDER ⬇️
    ssl: {
        rejectUnauthorized: false 
    }
});

// Test the connection logic
pool.getConnection((err, connection) => {
    if (err) {
        console.error("❌ Database Connection Failed:", err.message);
    } else {
        console.log("✅ Connected to Database successfully!");
        connection.release();
    }
});

module.exports = pool.promise();