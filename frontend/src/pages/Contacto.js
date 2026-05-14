import React from 'react';

const Contacto = () => {
    return (
        <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '70vh' }}>
            <div className="card" style={{ maxWidth: '600px', padding: '40px', textAlign: 'center' }}>
                <h2 style={{ color: 'var(--accent-coral)', fontFamily: 'Playfair Display, serif', fontSize: '2.5rem', marginBottom: '10px' }}>
                    Contacto del Desarrollador
                </h2>
                <h3 style={{ color: 'var(--primary-color)', marginBottom: '5px' }}>Juan Daniel Ticona Gutierrez</h3>
                <p style={{ color: 'var(--secondary-color)', fontWeight: '600', marginBottom: '30px' }}>
                    Estudiante de Ingeniería de Sistemas - USB
                </p>

                <div style={{ textAlign: 'left', display: 'inline-block', color: 'var(--primary-color)' }}>
                    <p style={{ marginBottom: '15px' }}>
                        <span style={{ color: 'var(--accent-gold)' }}>📧 Correo:</span> ticonagutierrezjuandaniel@gmail.com
                    </p>
                    <p style={{ marginBottom: '15px' }}>
                        <span style={{ color: 'var(--accent-gold)' }}>📱 WhatsApp:</span> +591 63213392
                    </p>
                    <p style={{ marginBottom: '15px' }}>
                        <span style={{ color: 'var(--accent-gold)' }}>📍 Ubicación:</span> La Paz, Bolivia
                    </p>
                </div>

                <div style={{ marginTop: '30px' }}>
                    <a href="mailto:ticonagutierrezjuandaniel@gmail.com" className="btn-main" style={{ display: 'block', textAlign: 'center' }}>
                        Enviar mensaje directo
                    </a>
                </div>
            </div>
        </div>
    );
};

export default Contacto;