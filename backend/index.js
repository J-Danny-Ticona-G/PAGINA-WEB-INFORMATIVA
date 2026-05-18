const app = require('./src/app');

const PORT = 5000;

// Inicialización oficial de la escucha del servidor Express
app.listen(PORT, () => {
    console.log('==============================================');
    console.log(`🚀 SERVIDOR ESCUCHANDO EN EL PUERTO ${PORT}`);
    console.log('📡 Esperando peticiones del Frontend...');
    console.log('==============================================');
});