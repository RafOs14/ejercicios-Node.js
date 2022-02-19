const express = require('express');
const session = require('express-session');
const flash = require('express-flash');
const app = express();
const mensaje = "Has llegado al limite de visitas";
app.use(session({ secret: 'token-muy-secreto', resave: true, saveUninitialized: true }));

app.get('/', (req, res) => {
    let visitas = req.session.visitas;
    if(visitas == undefined){
        visitas = 0;
    }else if(visitas == 10){
        res.send(`<h1>${mensaje}</h1>`);                
    }
    visitas += 1;    
    req.session.visitas = visitas;
    res.send(`Visitas ${visitas}`);
});

app.listen(3000, function(){
    console.log("Servidor iniciado");
})