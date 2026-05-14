const pool = require('../../db');

const obtenerSitios = async (req, res) => {
    try {
        // Seleccionamos específicamente las columnas de tu tabla sitios_culturales
        const resultado = await pool.query('SELECT id_sitio, nombre, descripcion, direccion FROM sitios_culturales ORDER BY nombre ASC');
        
        // Enviamos los resultados
        res.json(resultado.rows);
    } catch (error) {
        console.error("Error al consultar PostgreSQL:", error.message);
        res.status(500).json({ error: "Error en el servidor" });
    }
};

module.exports = { obtenerSitios };