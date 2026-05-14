import React from 'react';
import { Link } from 'react-router-dom';

const Inicio = () => {
    return (
        <div className="animate-in">
            <section className="hero">
                <div className="hero-content">
                    <h1>Plataforma de <br/> <span style={{color: 'var(--accent-gold)'}}>Gestión Cultural</span></h1>
                    <p>Un ecosistema digital diseñado para el patrimonio histórico y artístico de la ciudad de La Paz.</p>
                    <Link to="/museos" className="btn-main">Comenzar Exploración</Link>
                </div>
            </section>

            <div className="container">
                <div className="section-info" style={{background: 'white', padding: '50px', borderRadius: '30px', boxShadow: 'var(--shadow)'}}>
                    <h2 style={{marginBottom: '20px'}}>Sobre el Proyecto</h2>
                    <p style={{color: 'var(--secondary-color)', maxWidth: '800px'}}>
                        Este sistema permite la visualización centralizada y administración en tiempo real de los sitios culturales más importantes de la ciudad, facilitando el acceso a la información para ciudadanos y turistas desde la Universidad Salesiana de Bolivia.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Inicio;