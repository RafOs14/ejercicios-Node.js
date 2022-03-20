//Declaramos las variables que vamos a usar y las inicializamos
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mysql = require('mysql');


//Creamos el pool de conexiones a la base de datos
var pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'inventario'
});

app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));


//Consultar todos los productos
app.get('/', (req, res) => {
    pool.getConnection((err, connection) => {
        //Seleccionamos los productos ordenados por id
        let query = `SELECT * FROM productos ORDER BY id`;
        //Si el usuario presiona en precio
        if (req.query.orden == "precio") {
            //Ordenamos por precio
            query = `SELECT * FROM productos ORDER BY precio`;
            //Si el usuario presiona en cantidad
        } else if (req.query.orden == "cantidad") {
            //Ordenamos por cantidad
            query = `SELECT * FROM productos ORDER BY cantidad`;
            //Si el usuario presiona en nombre
        } else if (req.query.orden == "nombre") {
            //Ordenamos por nombre
            query = `SELECT * FROM productos ORDER BY nombre`;
        }
        //Ejecutamos la consulta
        connection.query(query, (err, filas, campos) => {
            //Retornamos la consulta
            res.render('index', {productos: filas});
        });
        //Cerramos la conexion
        connection.release();
    });
});


//Agregar un nuevo producto
app.post('/agregar', (req, res) => {
    pool.getConnection((err, connection) => {
        //Agregamos el producto a la base de datos indicando los tres campos
        const query = `
            INSERT INTO productos (nombre, cantidad, precio) 
            VALUES (
                ${connection.escape(req.body.nombre)},
                ${connection.escape(req.body.cantidad)},
                ${connection.escape(req.body.precio)}
            )`;
            //Ejecutamos la consulta
        connection.query(query, (err, filas, campos) => {
            //Redireccionamos a la pagina principal
            res.redirect('/');
        });
        //Liberamos la conexion
        connection.release();
    });
});

app.get('/eliminar', (req, res) => {
    pool.getConnection((err, connection) => {
        //Query que elimina un registro de la tabla productos dado un id
        const query = `DELETE FROM productos WHERE id=${connection.escape(req.query.id)}`;
        //Ejecutamos el query
        connection.query(query, (err, filas, campos) => {
            //Redireccionamos a la pagina principal
            res.redirect('/');
        });
        //Liberamos la conexion
        connection.release();
    });
});

//Mostramos por consola el puerto en el que esta escuchando el servidor
app.listen(3000, () => {
    console.log('Servidor iniciado en el puerto 3000');
});