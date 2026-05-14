import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Inicio from './pages/Inicio';
import Cultura from './pages/Cultura';
import Contacto from './pages/Contacto';
import { obtenerSitios } from './services/culturaService';

function App() {
    const [sitios, setSitios] = useState([]);

    useEffect(() => {
        const cargarDatos = async () => {
            const datos = await obtenerSitios();
            setSitios(datos || []);
        };
        cargarDatos();
    }, []);

    return (
        <Router>
            <Navbar />
            <Routes>
                <Route path="/" element={<Inicio />} />
                <Route path="/museos" element={<Cultura sitios={sitios} tipo="Museo" />} />
                <Route path="/teatros" element={<Cultura sitios={sitios} tipo="Teatro" />} />
                <Route path="/contacto" element={<Contacto />} />
            </Routes>
            <Footer />
        </Router>
    );
}

export default App;