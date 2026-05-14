import React from 'react';

const Cultura = ({ sitios, tipo }) => {
    // Filtrado lógico según la pestaña seleccionada (Museo o Teatro)
    const sitiosFiltrados = sitios.filter(sitio => {
        if (!tipo) return true;
        const nombreBuscado = sitio.nombre.toLowerCase();
        const tipoBuscado = tipo.toLowerCase();
        return nombreBuscado.includes(tipoBuscado);
    });

    return (
        <div className="layout">
            <section className="hero-banner">
                <div className="hero-content">
                    <h1>{tipo ? `${tipo}s de La Paz` : 'Patrimonio Cultural'}</h1>
                    <p>Gestión y difusión de los espacios artísticos de nuestra ciudad</p>
                </div>
            </section>

            <main className="container">
                <div className="grid-container">
                    {sitiosFiltrados && sitiosFiltrados.length > 0 ? (
                        sitiosFiltrados.map((sitio) => (
                            <div key={sitio.id_sitio_cultural || sitio.id_sitio} className="card">
                                {/* CONTENEDOR DE IMAGEN */}
                                <div className="card-image">
                                    <img 
                                        src={sitio.imagen_url || 'https://via.placeholder.com/400x250?text=Cultura+La+Paz'} 
                                        alt={sitio.nombre} 
                                        style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                                    />
                                </div>

                                <div className="card-content">
                                    <h2>{sitio.nombre}</h2>
                                    <p>{sitio.descripcion}</p>
                                    <hr style={{ margin: '15px 0', border: '0', borderTop: '1px solid #eee' }} />
                                    <div className="card-footer">
                                        <small>📍 {sitio.direccion}</small>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="no-data" style={{ textAlign: 'center', gridColumn: '1 / -1', padding: '50px' }}>
                            <h3>No se encontraron registros</h3>
                            <p>Actualiza tu base de datos sitios_culturales en pgAdmin.</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default Cultura;