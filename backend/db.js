const { Pool } = require('pg');

// Configuración limpia para tu PostgreSQL nativo de Windows (Localhost)
const pool = new Pool({
    user: 'postgres',           // Tu usuario por defecto de pgAdmin
    host: 'localhost',          // 'localhost' para que funcione directo en tu Windows
    database: 'cultura_lapaz',  // El nombre real de tu base de datos
    password: 'juanticona1999', // Tu contraseña real de Postgres
    port: 5432,                 // Puerto estándar de PostgreSQL
});

// Prueba de conexión rápida en consola
pool.connect((err, client, release) => {
    if (err) {
        return console.error('❌ Error adquiriendo el cliente de la BD', err.stack);
    }
    console.log('✨ Base de Datos conectada satisfactoriamente en Localhost');
    release();
});

module.exports = pool;