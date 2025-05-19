const express = require('express');
const app = express();
const port = 3000;

app.use(express.static('public'));
app.use(express.json());

let transacciones = [];
let id = 1;

app.get('/api/transacciones', (req, res) => res.json(transacciones));

app.post('/api/transacciones', (req, res) => {
    const { tipo, descripcion, monto } = req.body;
    const nueva = { id: id++, tipo, descripcion, monto: parseFloat(monto) };
    transacciones.push(nueva);
    res.status(201).json(nueva);
});

app.delete('/api/transacciones/:id', (req, res) => {
    transacciones = transacciones.filter(t => t.id != req.params.id);
    res.json({ mensaje: "Transacción eliminada" });
});

app.listen(port, () => console.log(`Servidor en http://localhost:${port}`));
