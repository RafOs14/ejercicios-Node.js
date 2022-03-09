const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mysql = require('mysql');

var pool = mysql.createPool({
    connectionLimit : 10,
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'inventario'
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/api/productos', (req, res) => {
    pool.getConnection(function(err, connection) {
        const sql = 'SELECT * FROM productos';
        connection.query(sql, (err, rows) => {
            res.json({data:rows});
        });
        connection.release();
    });
});


app.listen(3000, () => {
    console.log('Servidor corriendo en puerto 3000');
});