const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mysql = require('mysql');
const res = require('express/lib/response');

//Creamos el pool de conexiones a la base de datos
var pool = mysql.createPool({
    connectionLimit : 10,
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'inventario'
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Creamos un endpoint que nos devuelva todas las tareas
app.get('/api/productos', (req, res) => {
    //Creamos una query para obtener todas las tareas
    pool.getConnection(function(err, connection) {
        //Creamos la consulta
        const sql = 'SELECT * FROM productos ORDER BY nombre';
        //Validamos cual es el orden que debemos mostrar y lo mostramos en el orden indicado
        if(req.query.orden == "precio"){
            const sql = 'SELECT * FROM productos ORDER BY precio';
        }else if(req.query.orden == "cantidad"){
            const sql = 'SELECT * FROM productos ORDER BY cantidad';
        }else if(req.query.orden == "id"){
            const sql = 'SELECT * FROM productos ORDER BY id ASC';
        }
        //Ejecutamos la consulta
        connection.query(sql, (err, rows) => {
            //Nos devuelve una respuesta con el código 200 y el resultado de la query en formato JSON
            res.json({data:rows});
        });
        //Cerramos la conexión
        connection.release();
    });
});

//Funcion que nos devuelve una tarea segun un id especifico
app.get('/api/productos/:id', (req, res) => {
    pool.getConnection(function(err, connection) {
        //Guardamos la consulta en una variable indicando que el id es un parametro
        const sql = `SELECT * FROM productos WHERE id = ${connection.escape(req.params.id)}`;   
        const id = req.params.id;     
        //Ejecutamos la consulta
        connection.query(sql, id, (err, rows) => {
            //Si no existe el id, devolvemos un error
            if(rows.length == 0){
                res.status(404);
                res.send({errors: ["No existe un producto con el id indicado"]});
            }else{
                //Si existe el id, devolvemos el producto con el id indicado               
                res.json({data:rows[0]});
            }
        });
        //Liberamos la conexión
        connection.release();
    });
});

//Endpoint para añadir un producto
app.post('api/productos/', (req, res) => {
    pool.getConnection(function(err, connection) {
    errores = [];

    //Validamos que la información en los campos sea valida
    if (!req.body.nombre || req.body.nombre == ""){
        errores.push("Nombre invalido");
    }
    if (!req.body.cantidad || req.body.cantidad == ""){
        errores.push("Cantidad invalida");
    }
    if (!req.body.precio || req.body.precio == ""){
        errores.push("Precio invalido");
    }
    
    if (errores.length > 0){
        res.status(400);
        res.json({errors: errores});
    }
    else{
        //Si la información es valida, creamos la consulta
        const query = `INSERT INTO productos (nombre,cantidad,precio) VALUES 
        (${connection.escape(req.body.nombre)},
        ${connection.escape(req.body.cantidad)},
        ${connection.escape(req.body.precio)})`;

        connection.query(query, (err, rows) => {
           const nuevoId = rows.insertId;
           //Creamos la consulta para obtener la tarea creada
           const queryConsulta = `SELECT * FROM productos WHERE id=${connection.escape(nuevoId)}`
           //Ejecutamos la consulta
           connection.query(queryConsulta, (err, rows) => {
               res.status(201);
               //Nos devuelve una respuesta con el código 200 y el resultado de la query en formato JSON
                res.json({data:rows[0]});
            });
        });
    }
    connection.release();
    });
});

//Endpoint para actualizar un producto
app.put('/api/productos/:id', (req, res) => {
    pool.connection(function(err, connection) {
        //Guardamos la consulta en una variable indicando que el id es un parametro
        const sql = `SELECT * FROM productos WHERE id = ${connection.escape(req.params.id)}`;
        const id = req.params.id;
        //Ejecutamos la consulta
        connection.query(sql, (err, rows) => {
            if(rows.length > 0){
                modificaciones = [];
                if(req.body.nombre){
                    modificaciones.push(`nombre = ${connection.escape(req.body.nombre)}`);
                }
                if(req.body.cantidad){
                    modificaciones.push(`cantidad = ${connection.escape(req.body.cantidad)}`);
                }
                if(req.body.precio){
                    modificaciones.push(`precio = ${connection.escape(req.body.precio)}`);
                }
            
                //Query para actualizar los campos
                const queryUpdate = `UPDATE productos SET ${modificaciones.join(',')} WHERE id = ${req.params.id}`;
                //Ejecutamos la consulta
                connection.query(queryUpdate, (err, rows) => {
                    const queryConsulta = `SELECT * FROM productos WHERE id=${connection.escape(req.params.id)}`
                    connection.query(queryConsulta, (err, rows) => {
                        //Devolvemos una respuesta con el código 200 y el resultado de la query en formato JSON
                        res.json({data:rows[0]});
                    });
                });
            }else{
                //Si no existe el id, devolvemos un error
                res.status(404);
                res.send({errors: ["No existe un producto con el id indicado"]});
            }
        });
        connection.release();
    });
});


//Indicamos en que puerto estará escuchando el servidor
app.listen(3000, () => {
    console.log('Servidor iniciado en puerto 3000');
});