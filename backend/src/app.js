const express = require('express');
const cors = require('cors');
const pool = require('../db'); // RUTA CORREGIDA: sale de src para buscar db.js

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// --- RUTAS DEL SISTEMA ---

// OBTENER TODOS LOS SITIOS
app.get('/api/sitios', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM sitios_culturales ORDER BY id_sitio_cultural DESC');
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Error al leer la base de datos" });
    }
});

// AGREGAR UN SITIO (INSERT)
app.post('/api/sitios', async (req, res) => {
    const { nombre, descripcion, direccion, id_categoria, imagen_url } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO sitios_culturales (nombre, descripcion, direccion, id_categoria, imagen_url) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [nombre, descripcion, direccion, id_categoria, imagen_url]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Error al insertar datos" });
    }
});

// MODIFICAR UN SITIO (UPDATE)
app.put('/api/sitios/:id', async (req, res) => {
    const { id } = req.params;
    const { nombre, descripcion, direccion, id_categoria, imagen_url } = req.body;
    try {
        await pool.query(
            'UPDATE sitios_culturales SET nombre=$1, descripcion=$2, direccion=$3, id_categoria=$4, imagen_url=$5 WHERE id_sitio_cultural=$6',
            [nombre, descripcion, direccion, id_categoria, imagen_url, id]
        );
        res.json({ message: "Registro actualizado correctamente" });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Error al actualizar datos" });
    }
});

// ELIMINAR UN SITIO (DELETE)
app.delete('/api/sitios/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM sitios_culturales WHERE id_sitio_cultural = $1', [id]);
        res.json({ message: "Registro eliminado con éxito" });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Error al eliminar" });
    }
});

module.exports = app;