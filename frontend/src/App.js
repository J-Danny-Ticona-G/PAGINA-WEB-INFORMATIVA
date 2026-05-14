import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// IMPORTACIÓN DE ESTILOS (VITAL PARA EL DISEÑO DORADO)
import './index.css'; 

// COMPONENTES DE ESTRUCTURA
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// PÁGINAS
import Inicio from './pages/Inicio';
import Cultura from './pages/Cultura';
import Contacto from './pages/Contacto';
import Admin from './pages/Admin'; // Asegúrate de que el nombre del archivo sea Admin.js

// SERVICIOS
import { obtenerSitios } from './services/culturaService';

function App() {
    const [sitios, setSitios] = useState([]);

    // Función para cargar datos que podremos reutilizar
    const cargarDatos = async () => {
        try {
            const datos = await obtenerSitios();
            setSitios(datos || []);
        } catch (error) {
            console.error("Error al conectar con el backend:", error);
        }
    };

    useEffect(() => {
        cargarDatos();
    }, []);

    return (
        <Router>
            <div className="main-wrapper"> {/* Contenedor opcional para asegurar el fondo negro */}
                <Navbar />
                
                <Routes>
                    {/* Ruta de Inicio */}
                    <Route path="/" element={<Inicio />} />
                    
                    {/* Rutas de Visualización Cultural */}
                    <Route path="/museos" element={<Cultura sitios={sitios} tipo="Museo" />} />
                    <Route path="/teatros" element={<Cultura sitios={sitios} tipo="Teatro" />} />
                    
                    {/* Ruta de Contacto */}
                    <Route path="/contacto" element={<Contacto />} />
                    
                    {/* RUTA DE ADMINISTRACIÓN (CRUD) */}
                    <Route 
                        path="/admin" 
                        element={<Admin sitios={sitios} setSitios={setSitios} />} 
                    />
                </Routes>

                <Footer />
            </div>
        </Router>
    );
}

export default App;