const app = require('./src/app');

const PORT = 5000;

app.listen(PORT, () => {
    console.log('==============================================');
    console.log(`🚀 SERVIDOR ACTIVO EN: http://localhost:${PORT}`);
    console.log('✅ CONEXIÓN CON POSTGRESQL LISTA');
    console.log('==============================================');
});