const express = require('express');
const router = express.Router();

router.get('/salsa', (req, res) => {
    const fecha = new Date();
    res.type("html");
    res.send(`<!DOCTYPE html>
    <html lang="es">
    
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <title>Mi Evento</title>
    </head>
    
    <body>
        <h1>Mi Evento - Salsa</h1>
        <h6>${fecha}</h6>
        <p>Bienvenido a la página de Eventos sobre Salsa</p>
    </body>
    </html>`);
});

router.get('/tango', (req, res) => {
    const fecha = new Date();
    res.type("html");
    res.send(`<!DOCTYPE html>
    <html lang="es">
    
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <title>Mi Evento</title>
    </head>
    
    <body>
        <h1>Mi Evento - Tango</h1>
        <h6>${fecha}</h6>
        <p>Bienvenido a la página de Eventos sobre Tango</p>
    </body>
    </html>`);
});


module.exports = router;