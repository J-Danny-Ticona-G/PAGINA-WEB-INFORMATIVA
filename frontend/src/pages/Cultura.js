import React from 'react';

const Cultura = ({ sitios, tipo }) => {
    const sitiosFiltrados = sitios.filter(s => s.id_categoria === (tipo === 'Museo' ? 1 : 2));

    return (
        <div className="container">
            <h2 style={{marginBottom: '40px', fontSize: '2.5rem'}}>{tipo}s Disponibles</h2>
            <div className="grid">
                {sitiosFiltrados.map(s => (
                    <div className="card" key={s.id_sitio_cultural}>
                        <img src={s.imagen_url || 'https://via.placeholder.com/400x240'} className="card-img" alt={s.nombre} />
                        <div className="card-body">
                            <div className="card-category">{tipo}</div>
                            <h3 className="card-title">{s.nombre}</h3>
                            <p className="card-text">{s.descripcion.substring(0, 120)}...</p>
                            <div style={{marginTop: '15px', color: 'var(--accent-gold)', fontWeight: 'bold', fontSize: '0.8rem'}}>
                                📍 {s.direccion}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Cultura;