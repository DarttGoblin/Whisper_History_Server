const mysql = require("mysql");
const express = require("express");
const cors = require("cors");

const app = express();
const port = 7000;

app.use(express.json());
app.use(cors({ origin: "*" }));

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

// Create a connection pool
const pool = mysql.createPool({
    connectionLimit: 10, // Adjust the limit as needed
    host: 'sql7.freesqldatabase.com',
    user: 'sql7724126',
    password: 'V6PCDXyNdv',
    database: 'sql7724126'
});

app.post("/", (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Error getting connection from pool: ' + err.stack);
            res.status(500).json({ success: false, error: 'Error connecting to the database, ' + err.stack });
            return;
        }
        console.log('Connected to database with connection id ' + connection.threadId);

        connection.query('SELECT * FROM conversation0', (error, results) => {
            connection.release(); // Release the connection back to the pool

            if (error) {
                console.log('Error ' + error.stack);
                res.status(500).json({ success: false, error: error.stack });
                return;
            }
            res.status(200).json({ success: true, messages: results });
        });
    });
});

app.listen(port, () => console.log("Listening on port " + port));
