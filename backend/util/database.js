const mysql = require('mysql2');

const pool = mysql.createPool({
    host:  process.env.DATABASE_URL ?? 'localhost',
    user:  process.env.DATABASE_USER ?? 'root',
    database:  process.env.DATABASE_NAME ?? 'nebula',
    password:  process.env.DATABASE_PASSWORD ?? ''
});

module.exports = pool.promise();