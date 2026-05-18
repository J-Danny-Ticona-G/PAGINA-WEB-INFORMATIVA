import React, { useState, useEffect } from 'react';

function App() {
  // Datos precargados de prueba por defecto con la propiedad 'zona'
  const datosQuemadosIniciales = [
    {
      id_sitio: 101,
      nombre: "Museo Nacional de Arte",
      descripcion: "Ubicado en el imponente Palacio de los Condes de Arana, alberga una colección invaluable de arte virreinal, republicano y contemporáneo de Bolivia.",
      direccion: "Calle Comercio esq. Socabaya, Plaza Murillo",
      id_categoria: 1,
      zona: "Centro",
      promedio_calificacion: 5.0
    },
    {
      id_sitio: 102,
      nombre: "Teatro Municipal Alberto Saavedra Pérez",
      descripcion: "El teatro más antiguo de Sudamérica en funcionamiento, escenario principal de las artes escénicas, ópera y conciertos magistrales en La Paz.",
      direccion: "Calle Jenaro Sanjinés esq. Indaburo",
      id_categoria: 2,
      zona: "Centro",
      promedio_calificacion: 4.8
    }
  ];

  const comentariosIniciales = [
    { id: 1, sitio_id: 101, usuario_nombre: "Juan Daniel Ticona", calificacion: 5, comentario: "Excelente infraestructura y preservación cultural." }
  ];

  const agendaEventosIniciales = [
    { id_evento: 1, sitio_id: 101, titulo: "Exposición de Pintura Virreinal", hora: "15:00", esGratuito: true },
    { id_evento: 2, sitio_id: 101, titulo: "Visita Guiada Nocturna", hora: "19:00", esGratuito: false },
    { id_evento: 3, sitio_id: 102, titulo: "Presentación de la Orquesta Sinfónica", hora: "19:30", esGratuito: false },
    { id_evento: 4, sitio_id: 102, titulo: "Coloquio: Teatro Paceño Contemporáneo", hora: "11:00", esGratuito: true }
  ];

  // CARGA INICIAL CON LOCALSTORAGE
  const [sitios, setSitios] = useState(() => {
    const guardados = localStorage.getItem('sitios_culturales_local');
    return guardados ? JSON.parse(guardados) : datosQuemadosIniciales;
  });

  const [resenas, setResenas] = useState(() => {
    const guardadas = localStorage.getItem('comentarios_culturales_local');
    return guardadas ? JSON.parse(guardadas) : comentariosIniciales;
  });

  const [eventos, setEventos] = useState(() => {
    const guardados = localStorage.getItem('eventos_culturales_local');
    return guardados ? JSON.parse(guardados) : agendaEventosIniciales;
  });

  // Estados de control del flujo y filtros
  const [sitiosFiltrados, setSitiosFiltrados] = useState(sitios);
  const [sitioSeleccionado, setSitioSeleccionado] = useState(sitios.length > 0 ? sitios[0].id_sitio : null);

  const [busquedaTexto, setBusquedaTexto] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState('Todos');
  const [filtroZona, setFiltroZona] = useState('Todas'); 
  const [soloGratuitos, setSoloGratuitos] = useState(false); 

  const [nuevaResena, setNuevaResena] = useState({ usuario_nombre: '', calificacion: 5, comentario: '' });
  const [vistaAdmin, setVistaAdmin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [credenciales, setCredenciales] = useState({ usuario: '', contrasena: '' });
  
  const [nuevoSitio, setNuevoSitio] = useState({ nombre: '', descripcion: '', direccion: '', id_categoria: '1', zona: 'Centro', imagen_url: '' });
  const [nuevoEvento, setNuevoEvento] = useState({ titulo: '', hora: '', esGratuito: false });

  // Sincronizar filtros al cambiar dependencias
  useEffect(() => {
    ejecutarFiltradoLocal(busquedaTexto, filtroCategoria, filtroZona, soloGratuitos);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sitios, eventos, soloGratuitos]);

  // MOTOR DE FILTRADO LOCAL MULTICRITERIO EXPANDIDO
  const ejecutarFiltradoLocal = (texto, categoria, zona, gratis) => {
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

    if (zona !== 'Todas') {
      copia = copia.filter(s => s.zona === zona);
    }

    if (gratis) {
      copia = copia.filter(s => 
        eventos.some(e => e.sitio_id === s.id_sitio && e.esGratuito === true)
      );
    }

    setSitiosFiltrados(copia);
    if (copia.length > 0) {
      if (!copia.some(s => s.id_sitio === sitioSeleccionado)) {
        setSitioSeleccionado(copia[0].id_sitio);
      }
    } else {
      setSitioSeleccionado(null);
    }
  };

  const manejarBusquedaSubmit = (e) => {
    e.preventDefault();
    ejecutarFiltradoLocal(busquedaTexto, filtroCategoria, filtroZona, soloGratuitos);
  };

  const obtenerPromedioSitio = (idSitio, califBase) => {
    const notas = resenas.filter(r => r.sitio_id === idSitio);
    if (notas.length === 0) return parseFloat(califBase || 0);
    const suma = notas.reduce((acc, curr) => acc + curr.calificacion, 0);
    return parseFloat(suma / notas.length);
  };

  const manejarEnvioResena = (e) => {
    e.preventDefault();
    if (!sitioSeleccionado) return alert('Selecciona un espacio primero.');

    const comentarioNuevo = {
      id: Date.now(),
      sitio_id: sitioSeleccionado,
      usuario_nombre: nuevaResena.usuario_nombre,
      calificacion: parseInt(nuevaResena.calificacion),
      comentario: nuevaResena.comentario
    };

    const listaComentariosActualizada = [comentarioNuevo, ...resenas];
    setResenas(listaComentariosActualizada);
    localStorage.setItem('comentarios_culturales_local', JSON.stringify(listaComentariosActualizada));

    setNuevaResena({ usuario_nombre: '', calificacion: 5, comentario: '' });
    alert('¡Feedback registrado con éxito!');
  };

  const manejarCrearEvento = (e) => {
    e.preventDefault();
    if (!sitioSeleccionado) return alert('Seleccione un centro cultural primero.');

    const eventoNuevo = {
      id_evento: Date.now(),
      sitio_id: sitioSeleccionado,
      titulo: nuevoEvento.titulo,
      hora: nuevoEvento.hora,
      esGratuito: nuevoEvento.esGratuito
    };

    const listaEventosActualizada = [eventoNuevo, ...eventos];
    setEventos(listaEventosActualizada);
    localStorage.setItem('eventos_culturales_local', JSON.stringify(listaEventosActualizada));

    setNuevoEvento({ titulo: '', hora: '', esGratuito: false });
    alert('¡Evento agregado con éxito a la agenda!');
  };

  const manejarLogin = (e) => {
    e.preventDefault();
    if (credenciales.usuario === 'admin' && credenciales.contrasena === 'salesiana2026') {
      setIsLoggedIn(true);
      setCredenciales({ usuario: '', contrasena: '' });
    } else {
      alert('Credenciales inválidas.');
    }
  };

  const manejarCrearSitio = async (e) => {
    e.preventDefault();
    
    const elementoNuevo = {
      id_sitio: Date.now(), 
      nombre: nuevoSitio.nombre,
      descripcion: nuevoSitio.descripcion,
      direccion: nuevoSitio.direccion,
      id_categoria: parseInt(nuevoSitio.id_categoria),
      zona: nuevoSitio.zona, 
      promedio_calificacion: 0.0
    };

    const listaActualizada = [elementoNuevo, ...sitios];
    setSitios(listaActualizada);
    localStorage.setItem('sitios_culturales_local', JSON.stringify(listaActualizada));
    
    setNuevoSitio({ nombre: '', descripcion: '', direccion: '', id_categoria: '1', zona: 'Centro', imagen_url: '' });
    setBusquedaTexto('');
    setFiltroCategoria('Todos');
    setFiltroZona('Todas');
    setSoloGratuitos(false);
    setSitioSeleccionado(elementoNuevo.id_sitio);

    alert('¡Centro cultural registrado exitosamente!');
    setVistaAdmin(false); 
  };

  const sitiosOrdenadosPorRating = [...sitios].sort((a, b) => 
    obtenerPromedioSitio(b.id_sitio, b.promedio_calificacion) - obtenerPromedioSitio(a.id_sitio, a.promedio_calificacion)
  );

  // LOGICA DEL CUADRO DE REPORTES ESTADÍSTICOS EN TIEMPO REAL
  const totalMuseos = sitios.filter(s => s.id_categoria === 1).length;
  const totalTeatros = sitios.filter(s => s.id_categoria === 2).length;

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', backgroundColor: '#fff', minHeight: '100vh' }}>
      
      {/* CABECERA ACADÉMICA */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '2px solid #b8860b', paddingBottom: '10px' }}>
        <div style={{ textAlign: 'left' }}>
          <h1 style={{ color: '#000', margin: '0', fontSize: '26px' }}>Plataforma de Gestión Cultural - La Paz</h1>
          <p style={{ color: '#555', fontStyle: 'italic', margin: '5px 0 0 0' }}>LA CULTURA ES NUESTRA HERENCIA</p>
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
        <div style={{ display: 'flex', gap: '20px', maxWidth: '1000px', margin: '20px auto' }}>
          {/* PANEL DE CREAR SITIOS */}
          <section style={{ flex: 1, padding: '25px', backgroundColor: '#f9f9f9', borderRadius: '8px', border: '1px solid #ddd' }}>
            {!isLoggedIn ? (
              <form onSubmit={manejarLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <h2 style={{ margin: '0 0 10px 0', color: '#000', fontSize: '20px', textAlign: 'center' }}>Control de Acceso Administrativo</h2>
                <input type="text" placeholder="Usuario (admin)" required value={credenciales.usuario} onChange={(e) => setCredenciales({ ...credenciales, usuario: e.target.value })} style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }} />
                <input type="password" placeholder="Contraseña" required value={credenciales.contrasena} onChange={(e) => setCredenciales({ ...credenciales, contrasena: e.target.value })} style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }} />
                <button type="submit" style={{ backgroundColor: '#b8860b', color: '#fff', padding: '10px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Validar Token de Sesión</button>
              </form>
            ) : (
              <form onSubmit={manejarCrearSitio} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <h2 style={{ margin: '0', color: '#b8860b', fontSize: '20px' }}>1. Registrar Centro Cultural</h2>
                <input type="text" placeholder="Nombre del Espacio" required value={nuevoSitio.nombre} onChange={(e) => setNuevoSitio({ ...nuevoSitio, nombre: e.target.value })} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
                <textarea placeholder="Descripción técnica o histórica..." required rows="3" value={nuevoSitio.descripcion} onChange={(e) => setNuevoSitio({ ...nuevoSitio, descripcion: e.target.value })} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', resize: 'none' }} />
                <input type="text" placeholder="Dirección exacta" required value={nuevoSitio.direccion} onChange={(e) => setNuevoSitio({ ...nuevoSitio, direccion: e.target.value })} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
                
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <label style={{ fontSize: '14px', fontWeight: 'bold' }}>Ubicación Zonal:</label>
                  <select value={nuevoSitio.zona} onChange={(e) => setNuevoSitio({ ...nuevoSitio, zona: e.target.value })} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', flex: 1 }}>
                    <option value="Centro">Macrodistrito Centro</option>
                    <option value="Sopocachi">Sopocachi / Cotahuma</option>
                    <option value="Miraflores">Miraflores</option>
                    <option value="Zona Sur">Macrodistrito Sur</option>
                  </select>
                </div>

                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <label style={{ fontSize: '14px', fontWeight: 'bold' }}>Clasificación:</label>
                  <select value={nuevoSitio.id_categoria} onChange={(e) => setNuevoSitio({ ...nuevoSitio, id_categoria: e.target.value })} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', flex: 1 }}><option value="1">Museo</option><option value="2">Teatro</option></select>
                </div>
                <button type="submit" style={{ backgroundColor: '#000', color: '#fff', padding: '12px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Impactar Base de Datos</button>
              </form>
            )}
          </section>

          {/* PANEL ADMIN PARA AGREGAR EVENTOS A LA AGENDA */}
          {isLoggedIn && (
            <section style={{ flex: 1, padding: '25px', backgroundColor: '#f9f9f9', borderRadius: '8px', border: '1px solid #ddd' }}>
              <form onSubmit={manejarCrearEvento} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <h2 style={{ margin: '0', color: '#2e7d32', fontSize: '20px' }}>2. Cargar Evento a la Agenda</h2>
                <p style={{ margin: '0', fontSize: '13px', color: '#555' }}>
                  Añadiendo evento para: <strong>{sitios.find(s => s.id_sitio === sitioSeleccionado)?.nombre || "Ninguno seleccionado"}</strong>
                </p>
                <input type="text" placeholder="Título del Evento" required value={nuevoEvento.titulo} onChange={(e) => setNuevoEvento({ ...nuevoEvento, titulo: e.target.value })} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
                <input type="text" placeholder="Hora de Inicio" required value={nuevoEvento.hora} onChange={(e) => setNuevoEvento({ ...nuevoEvento, hora: e.target.value })} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '5px 0' }}>
                  <input type="checkbox" id="esGratuitoAdmin" checked={nuevoEvento.esGratuito} onChange={(e) => setNuevoEvento({ ...nuevoEvento, esGratuito: e.target.checked })} style={{ transform: 'scale(1.2)', cursor: 'pointer' }} />
                  <label htmlFor="esGratuitoAdmin" style={{ fontSize: '14px', fontWeight: 'bold', color: '#2e7d32', cursor: 'pointer' }}>¿Este evento es de Ingreso Gratuito?</label>
                </div>
                <button type="submit" style={{ backgroundColor: '#2e7d32', color: '#fff', padding: '12px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Publicar en Agenda del Día</button>
              </form>
            </section>
          )}
        </div>
      ) : (
        <>
          {/* BARRA DE BÚSQUEDA MULTICRITERIO INTEGRADA EXPANDIDA */}
          <section style={{ marginBottom: '20px', backgroundColor: '#f5f5f5', padding: '15px', borderRadius: '6px', border: '1px solid #e0e0e0' }}>
            <form onSubmit={manejarBusquedaSubmit} style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
              <input 
                type="text" 
                placeholder="Buscar por nombre o descripción..." 
                value={busquedaTexto}
                onChange={(e) => {
                  setBusquedaTexto(e.target.value);
                  ejecutarFiltradoLocal(e.target.value, filtroCategoria, filtroZona, soloGratuitos);
                }}
                style={{ flex: 2, minWidth: '180px', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
              />
              <select 
                value={filtroCategoria} 
                onChange={(e) => {
                  setFiltroCategoria(e.target.value);
                  ejecutarFiltradoLocal(busquedaTexto, e.target.value, filtroZona, soloGratuitos);
                }}
                style={{ flex: 1, minWidth: '130px', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
              >
                <option value="Todos">Todas las Categorías</option>
                <option value="1">Museos</option>
                <option value="2">Teatros</option>
              </select>

              <select 
                value={filtroZona} 
                onChange={(e) => {
                  setFiltroZona(e.target.value);
                  ejecutarFiltradoLocal(busquedaTexto, filtroCategoria, e.target.value, soloGratuitos);
                }}
                style={{ flex: 1, minWidth: '130px', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
              >
                <option value="Todas">Todas las Zonas</option>
                <option value="Centro">Centro</option>
                <option value="Sopocachi">Sopocachi</option>
                <option value="Miraflores">Miraflores</option>
                <option value="Zona Sur">Zona Sur</option>
              </select>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '0 5px' }}>
                <input 
                  type="checkbox" 
                  id="soloGratisCheck"
                  checked={soloGratuitos}
                  onChange={(e) => setSoloGratuitos(e.target.checked)}
                  style={{ transform: 'scale(1.2)', cursor: 'pointer' }}
                />
                <label htmlFor="soloGratisCheck" style={{ fontSize: '13px', fontWeight: 'bold', color: '#2e7d32', cursor: 'pointer' }}>
                  Solo Eventos Gratuitos
                </label>
              </div>

              <button type="submit" style={{ backgroundColor: '#000', color: '#fff', padding: '10px 15px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                Filtrar
              </button>
            </form>
          </section>

          {/* NUEVO COMPONENTE: PANEL DE REPORTES ESTADÍSTICOS EN TIEMPO REAL */}
          <section style={{ display: 'flex', gap: '15px', marginBottom: '25px' }}>
            <div style={{ flex: 1, backgroundColor: '#f9f9f9', padding: '15px', borderRadius: '6px', borderTop: '4px solid #b8860b', textAlign: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
              <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#666', uppercase: 'true' }}>Espacios Totales</div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#000', marginTop: '5px' }}>{sitios.length}</div>
            </div>
            <div style={{ flex: 1, backgroundColor: '#f9f9f9', padding: '15px', borderRadius: '6px', borderTop: '4px solid #2e7d32', textAlign: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
              <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#666' }}>Eventos Hoy</div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#000', marginTop: '5px' }}>{eventos.length}</div>
            </div>
            <div style={{ flex: 1, backgroundColor: '#f9f9f9', padding: '15px', borderRadius: '6px', borderTop: '4px solid #1565c0', textAlign: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
              <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#666' }}>Reseñas Emitidas</div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#000', marginTop: '5px' }}>{resenas.length}</div>
            </div>
            <div style={{ flex: 1, backgroundColor: '#f9f9f9', padding: '15px', borderRadius: '6px', borderTop: '4px solid #333', textAlign: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
              <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#666' }}>Museos / Teatros</div>
              <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#000', marginTop: '8px' }}>{totalMuseos} M / {totalTeatros} T</div>
            </div>
          </section>

          <div style={{ display: 'flex', gap: '25px' }}>
            {/* COLUMNA IZQUIERDA: RESULTADOS */}
            <div style={{ flex: 1, backgroundColor: '#f9f9f9', padding: '15px', borderRadius: '8px', border: '1px solid #ddd' }}>
              <h2 style={{ color: '#b8860b', marginTop: '0', fontSize: '20px' }}>Resultados Encontrados ({sitiosFiltrados.length})</h2>
              {sitiosFiltrados.length === 0 ? (
                <p style={{ color: '#888', fontSize: '14px' }}>No hay registros coincidentes.</p>
              ) : (
                sitiosFiltrados.map((sitio) => {
                  const ratingPromedio = obtenerPromedioSitio(sitio.id_sitio, sitio.promedio_calificacion);
                  const posicionPodio = sitiosOrdenadosPorRating.findIndex(s => s.id_sitio === sitio.id_sitio);
                  let medalla = null;
                  let colorBorde = '1px solid #ccc';
                  let fondoCard = '#fff';

                  if (posicionPodio === 0 && ratingPromedio > 0) {
                    medalla = "Top 1 Tendencia";
                    colorBorde = '2px solid #ffd700';
                    fondoCard = '#fffdf0';
                  } else if (posicionPodio === 1 && ratingPromedio > 0) {
                    medalla = "Top 2 Destacado";
                    colorBorde = '2px solid #c0c0c0';
                  } else if (posicionPodio === 2 && ratingPromedio > 0) {
                    medalla = "Top 3 Popular";
                    colorBorde = '2px solid #cd7f32';
                  }

                  return (
                    <div 
                      key={sitio.id_sitio} 
                      onClick={() => setSitioSeleccionado(sitio.id_sitio)}
                      style={{
                        padding: '12px',
                        marginBottom: '10px',
                        backgroundColor: sitioSeleccionado === sitio.id_sitio ? '#fff8e7' : fondoCard,
                        border: sitioSeleccionado === sitio.id_sitio ? '2px solid #b8860b' : colorBorde,
                        borderRadius: '6px',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      {medalla && <div style={{ marginBottom: '5px', fontSize: '11px', fontWeight: 'bold', color: '#b8860b' }}>{medalla}</div>}
                      <h3 style={{ margin: '0 0 5px 0', fontSize: '15px' }}>{sitio.nombre}</h3>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '5px' }}>
                        <span style={{ fontSize: '12px', backgroundColor: '#e5e5e5', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>
                          {ratingPromedio.toFixed(2)} estrellas
                        </span>
                        <span style={{ fontSize: '11px', backgroundColor: '#e3f2fd', color: '#1565c0', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>
                          Zona: {sitio.zona || "Centro"}
                        </span>
                      </div>
                      <p style={{ margin: '5px 0 0 0', fontSize: '13px', color: '#555' }}>Direccion: {sitio.direccion}</p>
                    </div>
                  );
                })
              )}
            </div>

            {/* COLUMNA DERECHA: APARTADO DETALLE Y ENTRADA DE DATOS */}
            <div style={{ flex: 1.5, display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              {sitioSeleccionado && (
                <div style={{ backgroundColor: '#fdfdfd', padding: '15px', borderRadius: '8px', border: '1px solid #e0e0e0' }}>
                  <h2 style={{ margin: '0 0 10px 0', color: '#000' }}>
                    {sitios.find(s => s.id_sitio === sitioSeleccionado)?.nombre}
                  </h2>
                  <p style={{ fontSize: '14px', lineHeight: '1.5', color: '#333', marginBottom: '15px' }}>
                    {sitios.find(s => s.id_sitio === sitioSeleccionado)?.descripcion}
                  </p>

                  {/* MÓDULO VISUAL DE AGENDA DE EVENTOS DEL DÍA */}
                  <div style={{ marginTop: '15px', borderTop: '1px dashed #ccc', paddingTop: '15px' }}>
                    <h4 style={{ margin: '0 0 10px 0', color: '#2e7d32', display: 'flex', alignItems: 'center', gap: '5px' }}>
                      Agenda Cultural de Hoy en este Espacio
                    </h4>
                    {eventos.filter(e => e.sitio_id === sitioSeleccionado).length === 0 ? (
                      <p style={{ color: '#777', fontSize: '13px', fontStyle: 'italic' }}>No hay eventos programados para hoy en este recinto.</p>
                    ) : (
                      eventos.filter(e => e.sitio_id === sitioSeleccionado).map(ev => (
                        <div key={ev.id_evento} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f1f8e9', padding: '8px 12px', borderRadius: '5px', marginBottom: '6px', borderLeft: '4px solid #4caf50' }}>
                          <div>
                            <strong style={{ fontSize: '13px', color: '#1b5e20' }}>{ev.titulo}</strong>
                            <div style={{ fontSize: '11px', color: '#555' }}>Hora: {ev.hora}</div>
                          </div>
                          <span style={{ fontSize: '11px', padding: '3px 8px', borderRadius: '12px', fontWeight: 'bold', backgroundColor: ev.esGratuito ? '#e8f5e9' : '#fff3e0', color: ev.esGratuito ? '#2e7d32' : '#e65100', border: ev.esGratuito ? '1px solid #a5d6a7' : '1px solid #ffcc80' }}>
                            {ev.esGratuito ? "Ingreso Libre" : "Con Costo"}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* CALIFICACIÓN Y FEEDBACK */}
              <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #ccc' }}>
                <h3 style={{ margin: '0 0 15px 0' }}>Añadir Calificación y Feedback</h3>
                <form onSubmit={manejarEnvioResena} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <input type="text" placeholder="Nombre completo" required value={nuevaResena.usuario_nombre} onChange={(e) => setNuevaResena({ ...nuevaResena, usuario_nombre: e.target.value })} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <label style={{ fontSize: '14px', fontWeight: 'bold' }}>Puntaje:</label>
                    <select value={nuevaResena.calificacion} onChange={(e) => setNuevaResena({ ...nuevaResena, calificacion: e.target.value })} style={{ padding: '6px', borderRadius: '4px', border: '1px solid #ccc' }}>
                      <option value="5">Puntaje: 5 - Excelente</option>
                      <option value="4">Puntaje: 4 - Muy Bueno</option>
                      <option value="3">Puntaje: 3 - Regular</option>
                      <option value="2">Puntaje: 2 - Malo</option>
                      <option value="1">Puntaje: 1 - Deficiente</option>
                    </select>
                  </div>
                  <textarea placeholder="Escriba un comentario..." required rows="2" value={nuevaResena.comentario} onChange={(e) => setNuevaResena({ ...nuevaResena, comentario: e.target.value })} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', resize: 'none' }}></textarea>
                  <button type="submit" style={{ backgroundColor: '#b8860b', color: '#fff', border: 'none', padding: '10px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Registrar Feedback</button>
                </form>
              </div>

              {/* HISTORIAL DE RESEÑAS */}
              <div style={{ backgroundColor: '#fdfdfd', padding: '20px', borderRadius: '8px', border: '1px solid #ddd' }}>
                <h3 style={{ margin: '0 0 15px 0', color: '#555' }}>Historial de Reseñas del Espacio</h3>
                {resenas.filter(r => r.sitio_id === sitioSeleccionado).length === 0 ? (
                  <p style={{ color: '#999', fontSize: '14px' }}>Este espacio aún no cuenta con comentarios históricos registrados.</p>
                ) : (
                  resenas.filter(r => r.sitio_id === sitioSeleccionado).map((res) => {
                    const lugarAsociado = sitios.find(s => s.id_sitio === res.sitio_id);
                    return (
                      <div key={res.id} style={{ borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '10px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                          <strong style={{ fontSize: '14px', color: '#333' }}>{res.usuario_nombre}</strong>
                          <span style={{ fontWeight: 'bold', color: '#b8860b' }}>Calificacion: {res.calificacion} / 5</span>
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