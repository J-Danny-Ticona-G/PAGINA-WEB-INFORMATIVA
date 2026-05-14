import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// IMPORTACIÓN DE ESTILOS GLOBALES
import './index.css'; 

// COMPONENTES DE ESTRUCTURA
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// PÁGINAS DEL SISTEMA
import Inicio from './pages/Inicio';
import Cultura from './pages/Cultura';
import Contacto from './pages/Contacto';
import Admin from './pages/Admin';
import Login from './pages/Login';

// SERVICIOS DE CONEXIÓN
import { obtenerSitios } from './services/culturaService';

function App() {
    const [sitios, setSitios] = useState([]);

    // FUNCIÓN PARA CARGAR DATOS DESDE POSTGRESQL (CULTURA_LAPAZ)
    const cargarDatos = async () => {
        try {
            const datos = await obtenerSitios();
            // Validamos que los datos sean un array para evitar errores de .map
            setSitios(Array.isArray(datos) ? datos : []);
        } catch (error) {
            console.error("Error al conectar con el servidor:", error);
            setSitios([]);
        }
    };

    // Ejecutar carga de datos al iniciar la aplicación
    useEffect(() => {
        cargarDatos();
    }, []);

    return (
        <Router>
            <div className="main-wrapper">
                {/* La Navbar se mantiene visible en todas las páginas */}
                <Navbar />
                
                <Routes>
                    {/* RUTA DE INICIO */}
                    <Route path="/" element={<Inicio />} />
                    
                    {/* RUTAS PÚBLICAS DE VISUALIZACIÓN */}
                    {/* Se pasan los sitios cargados y el tipo para filtrar en el componente */}
                    <Route 
                        path="/museos" 
                        element={<Cultura sitios={sitios} tipo="Museo" />} 
                    />
                    <Route 
                        path="/teatros" 
                        element={<Cultura sitios={sitios} tipo="Teatro" />} 
                    />
                    
                    {/* RUTA DE CONTACTO */}
                    <Route path="/contacto" element={<Contacto />} />
                    
                    {/* RUTA DE ACCESO (LOGIN) */}
                    <Route path="/login" element={<Login />} />

                    {/* RUTA DE ADMINISTRACIÓN (PROTEGIDA) */}
                    {/* Aquí es donde realizas el CRUD completo */}
                    <Route 
                        path="/admin" 
                        element={<Admin sitios={sitios} setSitios={setSitios} refreshData={cargarDatos} />} 
                    />

                    {/* REDIRECCIÓN POR DEFECTO */}
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>

                <Footer />
            </div>
        </Router>
    );
}

export default App;