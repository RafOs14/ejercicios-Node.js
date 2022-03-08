//Lista de tareas con node.js
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
        const query = `SELECT tareas.id AS id, tareas.descripcion, recursos.nombre FROM tareas INNER JOIN recursos ON tareas.id = recursos.tarea_id ORDER BY tareas.id`
        connection.query(query, (err, filas, campos) => {
            let tareas = []
            let tareaActual = {
              id: undefined
            }
      
            for (let i = 0; i < filas.length; i++) {
              if (tareaActual.id != filas[i].id){
                tareaActual = {
                  id: filas[i].id,
                  descripcion: filas[i].descripcion,
                  recursos: [ filas[i].nombre ]
                }
                tareas.push(tareaActual)
              }
              else{
                tareaActual.recursos.push(filas[i].nombre)
              }
            }
            //Cerramos la conexión
            res.render('index', {tareas: tareas});
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

//Eliminación de registro
app.get('/eliminar-tarea', (req, res) => {
    pool.getConnection((err, connection) => {
        //Declaramos la query y pasamos el id de la tarea a eliminar
        const query = `DELETE FROM tareas WHERE id=${connection.escape(req.query.id)}`;
        //Ejecutamos la consulta y redirigimos a la página principal
        connection.query(query, (err, filas, campos) => {
            res.redirect('/');
        });
        //Liberar conexión
        connection.release();
    });
});


app.listen(3000, () => {
    console.log('Server running on port 3000');
});