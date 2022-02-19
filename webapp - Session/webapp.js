const express = require('express');
const aplicacion = express();
const bodyParser = require('body-parser');
const session = require('express-session');
const flash = require('express-flash');

aplicacion.use(express.static('stylesheets'));
aplicacion.use(bodyParser.json());
aplicacion.use(bodyParser.urlencoded({extended: true}));
aplicacion.set('view engine', 'ejs');
aplicacion.use(session({ secret: 'token-muy-secreto', resave: true, saveUninitialized: true }));
aplicacion.use(flash());

//Ejemplo Sesion y Flash

aplicacion.get('/', (req, res) => {
    res.render('index', {error: req.flash('error')});
});

aplicacion.get('/home', (req, res) => {
    res.render('home', {usuario: req.session.usuario});
});

aplicacion.get('/detalle', (req, res) => {
    res.render('detalle', {usuario: req.session.usuario});
});

aplicacion.post('/autenticar', (req, res) => {
    if (req.body.usuario == 'admin' && req.body.contrasena == 'admin') {   
        req.session.usuario = req.body.usuario;     
        res.redirect('/home');
    } else {
        req.flash('error', "Usuario o contraseña incorrectos");
        res.redirect('/');
    };
});

aplicacion.get('/salir', (req, res) => {
    req.session.destroy();
    res.redirect("/");
});

aplicacion.listen(3000, () =>{
    console.log('Servidor iniciado en el puerto 3000');
});
