const express = require('express');
const router = express.Router();
const SitiosModel = require('../models/sitiosModel'); // Importamos el modelo de PostgreSQL

// 1. RUTA PARA OBTENER TODOS LOS SITIOS
// Esta es la que usará tu Frontend para mostrar las tarjetas en la página
router.get('/', async (req, res) => {
    try {
        const sitios = await SitiosModel.obtenerTodos();
        res.json(sitios);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener sitios', error: error.message });
    }
});

// 2. RUTA PARA CREAR UN NUEVO SITIO
// Aquí es donde mandas los datos desde tu formulario
router.post('/', async (req, res) => {
    const { nombre, descripcion, direccion, id_categoria } = req.body;
    
    // Validación básica para que no envíen campos vacíos
    if (!nombre || !id_categoria) {
        return res.status(400).json({ mensaje: 'El nombre y la categoría son obligatorios' });
    }

    try {
        const nuevoSitio = await SitiosModel.crear(nombre, descripcion, direccion, id_categoria);
        res.status(201).json(nuevoSitio);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al crear el sitio', error: error.message });
    }
});

// 3. RUTA PARA ELIMINAR UN SITIO
router.delete('/:id', async (req, res) => {
    try {
        const eliminado = await SitiosModel.eliminar(req.params.id);
        if (!eliminado) {
            return res.status(404).json({ mensaje: 'Sitio no encontrado' });
        }
        res.json({ mensaje: 'Sitio eliminado correctamente', sitio: eliminado });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al eliminar el sitio', error: error.message });
    }
});

module.exports = router;