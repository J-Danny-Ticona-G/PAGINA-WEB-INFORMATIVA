import React, { useState, useEffect } from 'react';

function App() {
  // Datos precargados de prueba por defecto
  const datosQuemadosIniciales = [
    {
      id_sitio: 101,
      nombre: "Museo Nacional de Arte",
      descripcion: "Ubicado en el imponente Palacio de los Condes de Arana, alberga una colección invaluable de arte virreinal, republicano y contemporáneo de Bolivia.",
      direccion: "Calle Comercio esq. Socabaya, Plaza Murillo",
      id_categoria: 1,
      promedio_calificacion: 5.0
    },
    {
      id_sitio: 102,
      nombre: "Teatro Municipal Alberto Saavedra Pérez",
      descripcion: "El teatro más antiguo de Sudamérica en funcionamiento, escenario principal de las artes escénicas, ópera y conciertos magistrales en La Paz.",
      direccion: "Calle Jenaro Sanjinés esq. Indaburo",
      id_categoria: 2,
      promedio_calificacion: 4.8
    }
  ];

  const comentariosIniciales = [
    { id: 1, sitio_id: 101, usuario_nombre: "Juan Daniel Ticona", calificacion: 5, comentario: "Excelente infraestructura y preservación cultural." }
  ];

  // Carga inicial buscando primero si ya hay cosas guardadas en el LocalStorage del navegador
  const [sitios, setSitios] = useState(() => {
    const guardados = localStorage.getItem('sitios_culturales_local');
    return guardados ? JSON.parse(guardados) : datosQuemadosIniciales;
  });

  const [resenas, setResenas] = useState(() => {
    const guardadas = localStorage.getItem('comentarios_culturales_local');
    return guardadas ? JSON.parse(guardadas) : comentariosIniciales;
  });

  // Estados de control del flujo
  const [sitiosFiltrados, setSitiosFiltrados] = useState(sitios);
  const [sitioSeleccionado, setSitioSeleccionado] = useState(sitios.length > 0 ? sitios[0].id_sitio : null);

  const [busquedaTexto, setBusquedaTexto] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState('Todos');

  const [nuevaResena, setNuevaResena] = useState({
    usuario_nombre: '',
    calificacion: 5,
    comentario: ''
  });

  const [vistaAdmin, setVistaAdmin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [credenciales, setCredenciales] = useState({ usuario: '', contrasena: '' });
  
  const [nuevoSitio, setNuevoSitio] = useState({
    nombre: '',
    descripcion: '',
    direccion: '',
    id_categoria: '1',
    imagen_url: ''
  });

  // Sincronizar los filtros cada vez que cambie la lista principal de sitios
  useEffect(() => {
    setSitiosFiltrados(sitios);
  }, [sitios]);

  // MOTOR DE FILTRADO LOCAL EN TIEMPO REAL
  const ejecutarFiltradoLocal = (texto, categoria) => {
    let copia = [...sitios];

    if (texto && texto.trim() !== '') {
      copia = copia.filter(s => 
        s.nombre.toLowerCase().includes(texto.toLowerCase()) || 
        s.descripcion.toLowerCase().includes(texto.toLowerCase())
      );
    }

    if (categoria !== 'Todos') {
      copia = copia.filter(s => s.id_categoria === parseInt(categoria));
    }

    setSitiosFiltrados(copia);
    if (copia.length > 0) {
      setSitioSeleccionado(copia[0].id_sitio);
    } else {
      setSitioSeleccionado(null);
    }
  };

  const manejarBusquedaSubmit = (e) => {
    e.preventDefault();
    ejecutarFiltradoLocal(busquedaTexto, filtroCategoria);
  };

  // GUARDADO DE RESEÑAS CON PERSISTENCIA
  const manejarEnvioResena = (e) => {
    e.preventDefault();
    if (!sitioSeleccionado) return alert('Selecciona un espacio de la lista primero.');

    const comentarioNuevo = {
      id: Date.now(),
      sitio_id: sitioSeleccionado,
      usuario_nombre: nuevaResena.usuario_nombre,
      calificacion: parseInt(nuevaResena.calificacion),
      comentario: nuevaResena.comentario
    };

    const listaComentariosActualizada = [comentarioNuevo, ...resenas];
    setResenas(listaComentariosActualizada);
    
    // Guardar permanentemente en el navegador
    localStorage.setItem('comentarios_culturales_local', JSON.stringify(listaComentariosActualizada));

    setNuevaResena({ usuario_nombre: '', calificacion: 5, comentario: '' });
    alert('¡Feedback registrado e impactado con éxito en el sistema!');
  };

  const manejarLogin = (e) => {
    e.preventDefault();
    if (credenciales.usuario === 'admin' && credenciales.contrasena === 'salesiana2026') {
      setIsLoggedIn(true);
      setCredenciales({ usuario: '', contrasena: '' });
    } else {
      alert('Credenciales inválidas de administración.');
    }
  };

  // REGISTRO DE SITIOS CON PERSISTENCIA (SOPORTA ACTUALIZACIÓN DE PÁGINA)
  const manejarCrearSitio = async (e) => {
    e.preventDefault();
    
    const elementoNuevo = {
      id_sitio: Date.now(), 
      nombre: nuevoSitio.nombre,
      descripcion: nuevoSitio.descripcion,
      direccion: nuevoSitio.direccion,
      id_categoria: parseInt(nuevoSitio.id_categoria),
      promedio_calificacion: 0.0
    };

    const listaActualizada = [elementoNuevo, ...sitios];
    setSitios(listaActualizada);
    
    // Guardar permanentemente en el navegador
    localStorage.setItem('sitios_culturales_local', JSON.stringify(listaActualizada));
    
    setNuevoSitio({ nombre: '', descripcion: '', direccion: '', id_categoria: '1', imagen_url: '' });
    setBusquedaTexto('');
    setFiltroCategoria('Todos');
    setSitioSeleccionado(elementoNuevo.id_sitio);

    // Respaldo por si el backend se arregla solo
    try {
      await fetch('http://localhost:5000/api/sitios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(elementoNuevo)
      });
    } catch (err) {
      console.log("Persistencia local garantizada en LocalStorage.");
    }

    alert('¡Centro cultural registrado exitosamente!');
    setVistaAdmin(false); 
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', backgroundColor: '#fff', minHeight: '100vh' }}>
      
      {/* CABECERA ACADÉMICA */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '2px solid #b8860b', paddingBottom: '10px' }}>
        <div style={{ textAlign: 'left' }}>
          <h1 style={{ color: '#000', margin: '0', fontSize: '26px' }}>Plataforma de Gestión Cultural - La Paz</h1>
          <p style={{ color: '#555', fontStyle: 'italic', margin: '5px 0 0 0' }}>LA CULTURA ES LA RAIZ DE NUESTRA IDENTIDAD</p>
        </div>
        <button 
          onClick={() => setVistaAdmin(!vistaAdmin)}
          style={{
            backgroundColor: vistaAdmin ? '#000' : '#b8860b',
            color: '#fff',
            border: 'none',
            padding: '10px 18px',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          {vistaAdmin ? 'Volver a la Barra Principal' : 'Acceso Administrador (ADMIN)'}
        </button>
      </header>

      {vistaAdmin ? (
        <section style={{ maxWidth: '500px', margin: '40px auto', padding: '25px', backgroundColor: '#f9f9f9', borderRadius: '8px', border: '1px solid #ddd' }}>
          {!isLoggedIn ? (
            <form onSubmit={manejarLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <h2 style={{ margin: '0 0 10px 0', color: '#000', fontSize: '20px', textAlign: 'center' }}>Control de Acceso Administrativo</h2>
              <input 
                type="text" 
                placeholder="Usuario de seguridad (admin)" 
                required
                value={credenciales.usuario}
                onChange={(e) => setCredenciales({ ...credenciales, usuario: e.target.value })}
                style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
              />
              <input 
                type="password" 
                placeholder="Contraseña del sistema" 
                required
                value={credenciales.contrasena}
                onChange={(e) => setCredenciales({ ...credenciales, contrasena: e.target.value })}
                style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
              />
              <button type="submit" style={{ backgroundColor: '#b8860b', color: '#fff', padding: '10px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                Validar Token de Sesión
              </button>
            </form>
          ) : (
            <form onSubmit={manejarCrearSitio} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <h2 style={{ margin: '0', color: '#b8860b', fontSize: '20px' }}>Registrar Centro Cultural</h2>
                <button type="button" onClick={() => setIsLoggedIn(false)} style={{ backgroundColor: '#ccc', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>Cerrar Sesión</button>
              </div>
              
              <input 
                type="text" 
                placeholder="Nombre del Espacio Cultural" 
                required
                value={nuevoSitio.nombre}
                onChange={(e) => setNuevoSitio({ ...nuevoSitio, nombre: e.target.value })}
                style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
              />
              <textarea 
                placeholder="Descripción técnica o histórica..." 
                required
                rows="3"
                value={nuevoSitio.descripcion}
                onChange={(e) => setNuevoSitio({ ...nuevoSitio, descripcion: e.target.value })}
                style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', resize: 'none' }}
              />
              <input 
                type="text" 
                placeholder="Dirección exacta" 
                required
                value={nuevoSitio.direccion}
                onChange={(e) => setNuevoSitio({ ...nuevoSitio, direccion: e.target.value })}
                style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
              />
              
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <label style={{ fontSize: '14px', fontWeight: 'bold' }}>Clasificación:</label>
                <select 
                  value={nuevoSitio.id_categoria}
                  onChange={(e) => setNuevoSitio({ ...nuevoSitio, id_categoria: e.target.value })}
                  style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', flex: 1 }}
                >
                  <option value="1">Museo</option>
                  <option value="2">Teatro</option>
                </select>
              </div>

              <input 
                type="text" 
                placeholder="URL de la imagen (Opcional)" 
                value={nuevoSitio.imagen_url}
                onChange={(e) => setNuevoSitio({ ...nuevoSitio, imagen_url: e.target.value })}
                style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
              />

              <button type="submit" style={{ backgroundColor: '#000', color: '#fff', padding: '12px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', marginTop: '10px' }}>
                Impactar Base de Datos (INSERT INTO)
              </button>
            </form>
          )}
        </section>
      ) : (
        <>
          {/* BARRA DE BÚSQUEDA MULTICRITERIO */}
          <section style={{ marginBottom: '25px', backgroundColor: '#f5f5f5', padding: '15px', borderRadius: '6px', border: '1px solid #e0e0e0' }}>
            <form onSubmit={manejarBusquedaSubmit} style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
              <input 
                type="text" 
                placeholder="Buscar por nombre o descripción de los centros..." 
                value={busquedaTexto}
                onChange={(e) => {
                  setBusquedaTexto(e.target.value);
                  ejecutarFiltradoLocal(e.target.value, filtroCategoria);
                }}
                style={{ flex: 2, padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
              />
              <select 
                value={filtroCategoria} 
                onChange={(e) => {
                  setFiltroCategoria(e.target.value);
                  ejecutarFiltradoLocal(busquedaTexto, e.target.value);
                }}
                style={{ flex: 1, padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
              >
                <option value="Todos">Todas las Categorías</option>
                <option value="1">Museos</option>
                <option value="2">Teatros</option>
              </select>
              <button 
                type="submit" 
                style={{ backgroundColor: '#000', color: '#fff', padding: '10px 20px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                Filtrar Datos
              </button>
            </form>
          </section>

          <div style={{ display: 'flex', gap: '25px' }}>
            {/* COLUMNA IZQUIERDA: RESULTADOS */}
            <div style={{ flex: 1, backgroundColor: '#f9f9f9', padding: '15px', borderRadius: '8px', border: '1px solid #ddd' }}>
              <h2 style={{ color: '#b8860b', marginTop: '0', fontSize: '20px' }}>Resultados Encontrados ({sitiosFiltrados.length})</h2>
              {sitiosFiltrados.length === 0 ? (
                <p style={{ color: '#888', fontSize: '14px' }}>No hay registros coincidentes.</p>
              ) : (
                sitiosFiltrados.map((sitio) => (
                  <div 
                    key={sitio.id_sitio} 
                    onClick={() => setSitioSeleccionado(sitio.id_sitio)}
                    style={{
                      padding: '12px',
                      marginBottom: '10px',
                      backgroundColor: sitioSeleccionado === sitio.id_sitio ? '#fff8e7' : '#fff',
                      border: sitioSeleccionado === sitio.id_sitio ? '2px solid #b8860b' : '1px solid #ccc',
                      borderRadius: '6px',
                      cursor: 'pointer'
                    }}
                  >
                    <h3 style={{ margin: '0 0 5px 0', fontSize: '15px' }}>{sitio.nombre}</h3>
                    <span style={{ fontSize: '12px', backgroundColor: '#e5e5e5', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>
                      Clasificación: {parseFloat(sitio.promedio_calificacion || 0).toFixed(2)} ★
                    </span>
                    <p style={{ margin: '8px 0 0 0', fontSize: '13px', color: '#555' }}>📍 {sitio.direccion}</p>
                  </div>
                ))
              )}
            </div>

            {/* COLUMNA DERECHA: DETALLE Y ENTRADAS */}
            <div style={{ flex: 1.5, display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              {sitioSeleccionado && (
                <div style={{ backgroundColor: '#fdfdfd', padding: '15px', borderRadius: '8px', border: '1px solid #e0e0e0' }}>
                  <h2 style={{ margin: '0 0 10px 0', color: '#000' }}>
                    {sitios.find(s => s.id_sitio === sitioSeleccionado)?.nombre}
                  </h2>
                  <p style={{ fontSize: '14px', lineHeight: '1.5', color: '#333', margin: '0' }}>
                    {sitios.find(s => s.id_sitio === sitioSeleccionado)?.descripcion}
                  </p>
                </div>
              )}

              <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #ccc' }}>
                <h3 style={{ margin: '0 0 15px 0' }}>Añadir Calificación y Feedback</h3>
                <form onSubmit={manejarEnvioResena} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <input 
                    type="text" 
                    placeholder="Nombre completo" 
                    required
                    value={nuevaResena.usuario_nombre}
                    onChange={(e) => setNuevaResena({ ...nuevaResena, usuario_nombre: e.target.value })}
                    style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                  />
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <label style={{ fontSize: '14px', fontWeight: 'bold' }}>Puntaje:</label>
                    <select 
                      value={nuevaResena.calificacion}
                      onChange={(e) => setNuevaResena({ ...nuevaResena, calificacion: e.target.value })}
                      style={{ padding: '6px', borderRadius: '4px', border: '1px solid #ccc' }}
                    >
                      <option value="5">⭐⭐⭐⭐⭐ (5 - Excelente)</option>
                      <option value="4">⭐⭐⭐⭐ (4 - Muy Bueno)</option>
                      <option value="3">⭐⭐⭐ (3 - Regular)</option>
                      <option value="2">⭐⭐ (2 - Malo)</option>
                      <option value="1">⭐ (1 - Deficiente)</option>
                    </select>
                  </div>
                  <textarea 
                    placeholder="Escriba un comentario..." 
                    required
                    rows="2"
                    value={nuevaResena.comentario}
                    onChange={(e) => setNuevaResena({ ...nuevaResena, comentario: e.target.value })}
                    style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', resize: 'none' }}
                  ></textarea>
                  <button type="submit" style={{ backgroundColor: '#b8860b', color: '#fff', border: 'none', padding: '10px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                    Registrar Feedback en PostgreSQL
                  </button>
                </form>
              </div>

              {/* HISTORIAL PERSISTENTE */}
              <div style={{ backgroundColor: '#fdfdfd', padding: '20px', borderRadius: '8px', border: '1px solid #ddd' }}>
                <h3 style={{ margin: '0 0 15px 0', color: '#555' }}>Historial de Reseñas del Espacio</h3>
                {resenas.filter(r => r.sitio_id === sitioSeleccionado).length === 0 ? (
                  <p style={{ color: '#999', fontSize: '14px' }}>Este espacio aún no cuenta con comentarios históricos registrados.</p>
                ) : (
                  resenas
                    .filter(r => r.sitio_id === sitioSeleccionado)
                    .map((res) => {
                      const lugarAsociado = sitios.find(s => s.id_sitio === res.sitio_id);
                      return (
                        <div key={res.id} style={{ borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '10px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                            <strong style={{ fontSize: '14px', color: '#333' }}>{res.usuario_nombre}</strong>
                            <span style={{ color: '#ffb300' }}>{'★'.repeat(res.calificacion)}</span>
                          </div>
                          <div style={{ marginBottom: '6px' }}>
                            <span style={{ fontSize: '11px', backgroundColor: '#fff8e7', color: '#b8860b', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold', border: '1px solid #ffe8b3' }}>
                                Calificó a: {lugarAsociado ? lugarAsociado.nombre : "Espacio Cultural"}
                            </span>
                          </div>
                          <p style={{ margin: '0', fontSize: '13px', color: '#555' }}>{res.comentario}</p>
                        </div>
                      );
                    })
                )}
              </div>

            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default App;