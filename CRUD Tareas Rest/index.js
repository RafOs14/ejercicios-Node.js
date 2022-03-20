const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mysql = require('mysql');
const { application } = require('express');

var pool = mysql.createPool({  
    connectionLimit : 10,
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'tareas_app'
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Creamos un endpoint que nos devuelva todas las tareas
app.get('/api/tareas', (req, res) => {
    //Creamos una query para obtener todas las tareas
    pool.getConnection(function(err, connection) {
        const sql = 'SELECT * FROM tareas';
        //Ejecutamos la query
        connection.query(sql, (err, rows) => {
            //Nos devuelve una respuesta con el código 200 y el resultado de la query en formato JSON
            res.json({data:rows});
        });
        //Cerramos la conexión
        connection.release();
    });
});

//Modificamos el endpoint para que nos devuelva una tarea en concreto con un id
app.get('/api/tareas/:id', (req, res) => {
    pool.getConnection(function(err, connection) {
        //Guardamos la consulta en una variable
        const sql = `SELECT * FROM tareas WHERE id = ${connection.escape(req.params.id)}`; 
        const id = req.params.id;      
        //Ejecutamos la consulta
        connection.query(sql, id, (err, rows) => {
            //Si existe al menos una fila mostramos la tarea con el id indicado
            if(rows.length > 0) {
                res.json({data:rows[0]});
            }else {
                //Si no existe el id, devolvemos un error
                res.status(404);
                res.send({errors: ["No existe una tarea para el id indicado"]});
            }
        });
        //Liberamos la conexión
        connection.release();
    });
});

// Creamos un endpoint que inserta una nueva tarea
app.post('/api/tareas/', (req, res) =>{
    pool.getConnection(function(err, connection) {
        //Creamos la consulta para insertar la tarea
        const sql = `INSERT INTO tareas (descripcion) VALUES (${connection.escape(req.body.descripcion)})`;
        connection.query(sql, (err, rows, fields) => {            
            const nuevoId = rows.insertId; 
            //Consulta por las tareas con el nuevo id
            const queryConsulta = `SELECT * FROM tareas WHERE id = ${nuevoId}`;
            connection.query(queryConsulta, (err, rows, fields) => {
                //Se devuelve el codigo 201 y la tarea insertada si todo ha ido bien
                res.status(201);
                //Se devuelve la tarea insertada
                res.json({data:rows[0]});
            });
        });
        connection.release();
    });
});

// Creamos un endpoint que modifica una tarea
app.put('/api/tareas/:id', (req, res) => {
    pool.getConnection(function (err, connection) {
        //Consultamos por una tarea con id valido y retornamos el objeto tarea
        const sql = `SELECT * FROM tareas WHERE id = ${connection.escape(req.params.id)}`;
        //Codigo que ejecuta el query
        connection.query(sql, (err, rows, fields) => {
            //Preguntamos si existe al menos una fila
            if(rows.length > 0) {
                //Si conseguimos el registro, enviamos el query de la actualizacion a la BD filtrando por el id
                const queryUpdate = `UPDATE tareas SET descripcion = ${connection.escape(req.body.descripcion)} WHERE id = ${connection.escape(req.params.id)}`;
                //Ejectuamos el query
                connection.query(queryUpdate, (err, rows, fields) => {
                    //Corremos un query para obtener la tarea actualizada
                    const queryConsulta = `SELECT * FROM tareas WHERE id = ${connection.escape(req.params.id)}`;
                    connection.query(queryConsulta, (err, rows, fields) => {
                        //Devolvemos el codigo 200 y la tarea actualizada
                        res.status(200);
                        res.json({data:rows[0]});
                    });
                });
            }else{
                //si no existe el id, retornamos un error y un mensaje
                res.status(404);
                res.send({errors: "No se encuentra una tarea con el id indicado"});
            }
        });
    });
});

// Creamos un endpoint que elimina una tarea
app.delete('/api/tareas/:id', (req, res) => {
    pool.getConnection(function(err, connection) {
        const query = `DELETE FROM tareas WHERE id = ${connection.esqape(req.params.id)}`;
        connection.query(query, (err,rows,fields) => {
            if(rows > 0){
                //Query para obtener la tarea eliminada
                const queryDelete = `DELETE FROM tareas WHERE id = ${connection.escape(req.params.id)}`;
                connection.query(queryDelete, (err, rows, fields) => {
                    //Si se ha eliminado al menos una fila, devolvemos un codigo 200
                res.status(200);
                res.send({data: "Tarea eliminada"});
                })                
            }else{
                //si no existe el id, retornamos un error y un mensaje
                res.status(404);
                res.send({errors: "No existe una tarea con el id indicado"});
            }
        });
    });
});

app.listen(3000, () => {
    console.log('Servidor corriendo en puerto 3000');
});

