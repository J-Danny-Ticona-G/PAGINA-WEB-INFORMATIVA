import React, { useEffect, useState } from 'react';

const Teatros = () => {
    const [teatros, setTeatros] = useState([]);

    useEffect(() => {
        fetch('http://localhost:5000/api/sitios')
            .then(res => res.json())
            .then(data => setTeatros(data.filter(s => s.id_categoria === 2)));
    }, []);

    return (
        <div style={{ padding: '40px' }}>
            <h1>Teatros de La Paz</h1>
            <p style={{ color: 'var(--cian-electrico)' }}>Gestión y difusión de los espacios artísticos</p>
            
            <div className="card-container">
                {teatros.map(t => (
                    <div className="card" key={t.id_sitio_cultural}>
                        {t.imagen_url && <img src={t.imagen_url} alt={t.nombre} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />}
                        <div className="card-content">
                            <div className="card-title">{t.nombre}</div>
                            <p className="card-text">{t.descripcion}</p>
                            <div className="card-location">📍 {t.direccion}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Teatros;