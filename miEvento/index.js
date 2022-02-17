const express = require('express');
const aplicacion = express();
const rutaGeneral = require('./routes/generales');
const rutaDeportes = require('./routes/deportes');
const rutaConciertos = require('./routes/conciertos');


aplicacion.use(rutaGeneral);
aplicacion.use(rutaDeportes);
aplicacion.use(rutaConciertos);


aplicacion.listen(3000, (req, res) => {
    console.log("Servidor iniciado en el puerto 3000");    
});