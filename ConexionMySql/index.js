const express = require('express');
const app = express();
const mysql = require('mysql');

app.set('view engine', 'ejs');

var pool = mysql.createPool({
    connectionLimit: 20,
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'blog'
});

app.get('/', (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) {
            console.log(err);
            res.status(500).send('Error de conexión a la base de datos');
        } else {
            connection.query('SELECT count(*) as total FROM noticias', (err, rows) => {
                if (err) {
                    console.log(err);
                    res.status(500).send('Error de consulta a la base de datos');
                } else {
                    res.render('index', {total: rows[0].total});
                
                }
            });
        }   
    }); 
});

app.listen(3000, () => {
    console.log('Servidor corriendo en el puerto 3000');
});