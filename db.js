// db.js
const sql = require('mssql');

// Database configuration
const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_DATABASE,
    options: {
        encrypt: false, // For Azure SQL
        trustServerCertificate: true, // Change to true for local dev / self-signed certs
    },
};

// Function to connect to the database
async function connect() {
    try {
        await sql.connect(config);
        console.log('Connected to SQL Server');
    } catch (err) {
        console.error('Error connecting to SQL Server:', err);
    }
}

module.exports = { connect };
