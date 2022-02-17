const express = require('express');
const router = express.Router();

router.get("/", (req, res) => {
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
        <h1>Mi Evento</h1>
        <h6>${fecha}</h6>
        <p>Bienvenido a la página de Eventos</p>
    </body>
    </html>`);
    });

    
module.exports = router;