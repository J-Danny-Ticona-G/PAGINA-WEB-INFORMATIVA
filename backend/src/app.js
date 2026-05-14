const express = require('express');
const cors = require('cors');
const pool = require('../db'); 

const app = express();

// Middlewares VITALES
app.use(cors());
app.use(express.json());

// ... (manten tus imports y middlewares anteriores)

// OBTENER TODOS LOS SITIOS (Para que aparezcan en Museos/Teatros)
app.get('/api/sitios', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM sitios_culturales ORDER BY id_sitio_cultural DESC');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ACTUALIZAR (PUT)
app.put('/api/sitios/:id', async (req, res) => {
    const { id } = req.params;
    const { nombre, descripcion, direccion, id_categoria, imagen_url } = req.body;
    try {
        await pool.query(
            'UPDATE sitios_culturales SET nombre=$1, descripcion=$2, direccion=$3, id_categoria=$4, imagen_url=$5 WHERE id_sitio_cultural=$6',
            [nombre, descripcion, direccion, id_categoria, imagen_url, id]
        );
        res.json({ message: "Actualizado con éxito" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ELIMINAR (DELETE)
app.delete('/api/sitios/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM sitios_culturales WHERE id_sitio_cultural = $1', [id]);
        res.json({ message: "Eliminado con éxito" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = app;