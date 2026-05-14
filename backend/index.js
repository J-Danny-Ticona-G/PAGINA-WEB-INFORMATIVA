const app = require('./src/app');

const PORT = 5000;

// Este bloque es el que evita que el proceso se cierre solo
app.listen(PORT, () => {
    console.log('==============================================');
    console.log(`🚀 SERVIDOR ESCUCHANDO EN EL PUERTO ${PORT}`);
    console.log('📡 Esperando peticiones del Frontend...');
    console.log('==============================================');
});