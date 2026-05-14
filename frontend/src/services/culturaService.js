const API_URL = 'http://localhost:5000/api/cultura';

export const obtenerSitios = async () => {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Error en la red');
        return await response.json();
    } catch (error) {
        console.error("Error al obtener datos:", error);
        return [];
    }
};