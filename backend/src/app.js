const express = require('express');
const cors = require('cors');
const pool = require('../db'); 

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// ==========================================
// MÓDULO ADMIN: REGISTRO DE NUEVOS ESPACIOS CULTURALES
// ==========================================
app.post('/api/sitios', async (req, res) => {
    try {
        const { nombre, descripcion, direccion, id_categoria, imagen_url } = req.body;
        
        const query = `
            INSERT INTO sitios_culturales (nombre, descripcion, direccion, id_categoria, imagen_url)
            VALUES ($1, $2, $3, $4, $5) RETURNING *;
        `;
        
        const result = await pool.query(query, [nombre, descripcion, direccion, parseInt(id_categoria), imagen_url || '']);
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Error al insertar sitio cultural:', err.message);
        res.status(500).send('Error en el servidor al registrar el sitio cultural.');
    }
});

// ==========================================
// MOTOR DE BÚSQUEDA CORREGIDO (MUESTRA TODO DIRECTAMENTE)
// ==========================================
app.get('/api/sitios/buscar', async (req, res) => {
    try {
        const { texto, tipo } = req.query;
        
        // Consulta base simplificada para asegurar compatibilidad total e inmediata
        let query = `
            SELECT s.*, 
                   COALESCE((SELECT AVG(calificacion) FROM comentarios WHERE sitio_id = s.id_sitio), 0) as promedio_calificacion
            FROM sitios_culturales s
        `;
        
        const params = [];
        let condicionales = [];

        // Filtro por texto
        if (texto && texto.trim() !== '') {
            params.push(`%${texto}%`);
            condicionales.push(`(s.nombre ILIKE $${params.length} OR s.descripcion ILIKE $${params.length})`);
        }

        // Filtro por Categoría (1 = Museo, 2 = Teatro)
        if (tipo && tipo !== 'Todos') {
            params.push(parseInt(tipo));
            condicionales.push(`s.id_categoria = $${params.length}`);
        }

        if (condicionales.length > 0) {
            query += ' WHERE ' + condicionales.join(' AND ');
        }

        query += ' ORDER BY s.id_sitio DESC';

        const result = await pool.query(query, params);
        res.json(result.rows);
    } catch (err) {
        console.error('Error en la búsqueda multicriterio:', err.message);
        res.status(500).send('Error en el servidor.');
    }
});

// ==========================================
// MÓDULO FEEDBACK: RESEÑAS Y COMENTARIOS
// ==========================================
app.get('/api/resenas/:sitio_id', async (req, res) => {
    try {
        const { sitio_id } = req.params;
        const query = 'SELECT * FROM comentarios WHERE sitio_id = $1 ORDER BY id_comentario DESC';
        const result = await pool.query(query, [sitio_id]);
        res.json(result.rows);
    } catch (err) {
        console.error('Error al obtener reseñas:', err.message);
        res.status(500).send('Error en el servidor.');
    }
});

app.post('/api/resenas', async (req, res) => {
    try {
        const { sitio_id, usuario_nombre, calificacion, comentario } = req.body;
        const query = `
            INSERT INTO comentarios (sitio_id, usuario_nombre, calificacion, comentario)
            VALUES ($1, $2, $3, $4) RETURNING *;
        `;
        const result = await pool.query(query, [sitio_id, usuario_nombre, calificacion, comentario]);
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Error al insertar reseña:', err.message);
        res.status(500).send('Error en el servidor.');
    }
});

// ==========================================
// RUTES DE RESPALDO (REQUERIDAS POR TU ARQUITECTURA)
// ==========================================
app.get('/api/usuarios', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM usuarios ORDER BY id_usuario ASC');
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error en el servidor.');
    }
});

app.get('/api/horarios', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM horarios ORDER BY id_horario ASC');
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error en el servidor.');
    }
});

app.get('/api/favoritos', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM favoritos ORDER BY id_favorito ASC');
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error en el servidor.');
    }
});

module.exports = app;