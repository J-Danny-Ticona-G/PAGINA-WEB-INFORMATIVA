const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',           // Tu usuario de pgAdmin
    host: 'db',          // Servidor local
    database: 'cultura_lapaz', // Reemplaza por el nombre real de tu BD
    password: 'juanticona1999',      // Reemplaza por tu contraseña
    port: 5432,                 // Puerto por defecto de Postgres
});

// Prueba de conexión rápida
pool.connect((err, client, release) => {
    if (err) {
        return console.error('❌ Error adquiriendo el cliente de la BD', err.stack);
    }
    console.log('✨ Base de Datos conectada satisfactoriamente');
    release();
});

module.exports = pool;