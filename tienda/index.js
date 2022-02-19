const express = require('express');
const app = express();
app.set('view engine', 'ejs');


app.get("/", (req, res) => {
    const datos = {
        nombre: "ZSE",
        direccion: "Calle 3 con Avenida 3. Edificio AURA. Local 1",
        telefonos: ["123-123123", "124-124124"],
    };
    res.render("index", { datos: datos });
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});