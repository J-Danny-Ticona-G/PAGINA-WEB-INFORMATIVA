import React from 'react';

const Contacto = () => {
    return (
        <div className="container" style={{ textAlign: 'center', padding: '100px 20px' }}>
            <div className="card" style={{ maxWidth: '600px', margin: '0 auto', padding: '40px' }}>
                <h1 style={{ color: '#e74c3c' }}>Contacto del Desarrollador</h1>
                <p style={{ fontSize: '1.2rem', marginBottom: '20px' }}>
                    <strong>Juan Daniel Ticona Gutierrez</strong><br />
                    Estudiante de Ingeniería de Sistemas - USB
                </p>
                <div style={{ textAlign: 'left', display: 'inline-block' }}>
                    <p>📧 <strong>Correo:</strong> ticonagutierrezjuandaniel@gmail.com</p>
                    <p>📱 <strong>WhatsApp:</strong> +519 63213392</p>
                    <p>📍 <strong>Ubicación:</strong> La Paz, Bolivia</p>
                </div>
                <div style={{ marginTop: '30px' }}>
                    <a href="https://wa.me/51963213392" target="_blank" rel="noopener noreferrer" className="btn-contact" style={{
                        background: '#25d366', color: 'white', padding: '10px 20px', borderRadius: '5px', textDecoration: 'none'
                    }}>Enviar mensaje directo</a>
                </div>
            </div>
        </div>
    );
};

export default Contacto;