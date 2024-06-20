// // src/db.js
// const mysql = require('mysql2/promise');

// const pool = mysql.createPool({
//     host: 'sql7.freemysqlhosting.net',        // Эндпоинт базы данных
//     user: 'sql7712638',    // Имя пользователя базы данных
//     password: 'awdePukZt3',// Пароль для базы данных
//     database: 'sql7712638',    // Имя базы данных
//     waitForConnections: true,
//     connectionLimit: 10,
//     queueLimit: 0
// });

// module.exports = pool;
// src/db.js
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: 'teachbridge.online',        // Эндпоинт базы данных
    user: 'u323519170_admin',    // Имя пользователя базы данных
    password: 'YNZlJ6g5f*',// Пароль для базы данных
    database: 'u323519170_suskers',    // Имя базы данных
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = pool;
