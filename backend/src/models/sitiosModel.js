const pool = require('../../db'); // Dos puntos para salir de models y de src // Importamos la conexión exitosa que probamos antes

const SitiosModel = {
    // 1. Obtener todos los sitios (Para mostrar en tu página principal)
    obtenerTodos: async () => {
        try {
            const res = await pool.query(`
                SELECT s.*, c.nombre_categoria 
                FROM sitios_culturales s
                LEFT JOIN categorias c ON s.id_categoria = c.id_categoria
                ORDER BY s.id_sitio ASC
            `);
            return res.rows;
        } catch (err) {
            console.error('Error en obtenerTodos:', err.message);
            throw err;
        }
    },

    // 2. Obtener un solo sitio por su ID (Para la vista de detalles)
    obtenerPorId: async (id) => {
        try {
            const res = await pool.query('SELECT * FROM sitios_culturales WHERE id_sitio = $1', [id]);
            return res.rows[0];
        } catch (err) {
            console.error('Error en obtenerPorId:', err.message);
            throw err;
        }
    },

    // 3. Crear un nuevo sitio (Migración de tu funcionalidad POST)
    crear: async (nombre, descripcion, direccion, id_categoria) => {
        try {
            const query = `
                INSERT INTO sitios_culturales (nombre, descripcion, direccion, id_categoria)
                VALUES ($1, $2, $3, $4)
                RETURNING *`;
            const values = [nombre, descripcion, direccion, id_categoria];
            const res = await pool.query(query, values);
            return res.rows[0];
        } catch (err) {
            console.error('Error en crear sitio:', err.message);
            throw err;
        }
    },

    // 4. Eliminar un sitio
    eliminar: async (id) => {
        try {
            const res = await pool.query('DELETE FROM sitios_culturales WHERE id_sitio = $1 RETURNING *', [id]);
            return res.rows[0];
        } catch (err) {
            console.error('Error en eliminar:', err.message);
            throw err;
        }
    }
};

module.exports = SitiosModel;