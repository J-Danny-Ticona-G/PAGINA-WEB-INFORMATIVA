import React from 'react';
import { Link } from 'react-router-dom';

const Inicio = () => {
    return (
        <div>
            <section className="hero-banner">
                <div className="hero-content">
                    <h1>Plataforma de Gestión Cultural</h1>
                    <p>Un sistema centralizado para el patrimonio de la ciudad de La Paz</p>
                    <Link to="/museos" style={{
                        background: '#e74c3c', color: 'white', padding: '12px 25px', 
                        borderRadius: '30px', textDecoration: 'none', display: 'inline-block', marginTop: '20px'
                    }}>Comenzar Exploración</Link>
                </div>
            </section>
            <main className="container">
                <h2>Sobre el Proyecto</h2>
                <p>Este sistema permite la visualización y administración de los sitios culturales más importantes, facilitando el acceso a la información para ciudadanos y turistas.</p>
            </main>
        </div>
    );
};

export default Inicio;