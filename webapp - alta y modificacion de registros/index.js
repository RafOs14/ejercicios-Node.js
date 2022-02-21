const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mysql = require('mysql');

var pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'tareas_app'
});

app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Ejemplo de insertar registro
app.get('/', (req, res) => {
    pool.getConnection((err, connection) => {
        const query = `SELECT * FROM tareas`;
        connection.query(query, (err, filas, campos) => {
            res.render('index', {tareas: filas});
        });
        connection.release();
    });
});

app.post('/agregar-tarea', (req, res) => {
    pool.getConnection((err, connection) => {
        const query = `INSERT INTO tareas (descripcion) VALUES (${connection.escape(req.body.descripcion)})`;
        connection.query(query, (err, filas, campos) => {
            res.redirect('/');
        });
        connection.release();
    });
});

//Ejemplo de modificar registro

app.get('/actualizar-formulario', (req, res) => {
    pool.getConnection((err, connection) => {
        const query = `SELECT * FROM tareas WHERE id = ${connection.escape(req.query.id)}`; 
        connection.query(query, (err, filas, campos) => {
            res.render('actualizar', {tarea: filas[0]});
        });
        connection.release();
    });
});

//Función para actualizar registro, recibe el id de la tarea a actualizar 
app.post('/actualizar-tarea', (req, res) => {
    pool.getConnection((err, connection) => {
        const query = `UPDATE tareas SET descripcion = ${connection.escape(req.body.descripcion)} WHERE id = ${connection.escape(req.body.id)}`;
        connection.query(query, (err, filas, campos) => {
            res.redirect('/');
        });
        connection.release();
    });
});


app.listen(3000, () => {
    console.log('Server running on port 3000');
});