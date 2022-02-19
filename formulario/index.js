const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Formulario</title>
    </head>
    <body>
        <h1>Inicio de sesióon</h1>
        <div>
            <form action="/procesar" method="post">
                <p>
                    <label for="nombre">Nombre</label>
                    <input type="text" name="nombre">
                </p>
                <p>
                    <label for="password">Email</label>
                    <input type="email" name="email">
                </p>
                <p>
                    <button type="submit">Ingresar</button>
                </p>
            </form>
        </div>
    </body>
    </html>`);
});



app.post('/procesar', (req, res) => {
    let re;
    re = /^[^ ]{6,}/
    if (!re.test(req.body.nombre)){
        res.send("El nombre no cumple con los requisitos mínimos");
        return
    }
    re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!re.test(req.body.email)){
        res.send("El campo email es obligatorio")
        return
    }
    res.send("Sesión iniciada correctamente");
});

app.listen(3000, function(){
    console.log("Servidor iniciado");    
});

