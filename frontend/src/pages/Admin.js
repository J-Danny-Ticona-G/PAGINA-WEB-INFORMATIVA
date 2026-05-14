import React, { useState, useEffect } from 'react';

const Admin = () => {
    const [sitios, setSitios] = useState([]);
    const [form, setForm] = useState({ nombre: '', descripcion: '', direccion: '', id_categoria: 1, imagen_url: '' });
    const [editId, setEditId] = useState(null);

    useEffect(() => { cargarDatos(); }, []);

    const cargarDatos = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/sitios');
            const data = await res.json();
            setSitios(data);
        } catch (err) { console.error("Error al cargar:", err); }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const url = editId ? `http://localhost:5000/api/sitios/${editId}` : 'http://localhost:5000/api/sitios';
        const method = editId ? 'PUT' : 'POST';

        const res = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form)
        });

        if (res.ok) {
            setEditId(null);
            setForm({ nombre: '', descripcion: '', direccion: '', id_categoria: 1, imagen_url: '' });
            cargarDatos();
            alert("Operación realizada con éxito");
        }
    };

    const eliminar = async (id) => {
        if (window.confirm("¿Deseas eliminar este sitio cultural de la base de datos?")) {
            await fetch(`http://localhost:5000/api/sitios/${id}`, { method: 'DELETE' });
            cargarDatos();
        }
    };

    const iniciarEdicion = (s) => {
        setEditId(s.id_sitio_cultural);
        setForm({
            nombre: s.nombre,
            descripcion: s.descripcion,
            direccion: s.direccion,
            id_categoria: s.id_categoria,
            imagen_url: s.imagen_url
        });
        window.scrollTo(0, 0);
    };

    return (
        <div className="admin-container">
            <div className="hero-section">
                <h1>{editId ? 'Edición de Registro' : 'Plataforma de Gestión'}</h1>
                <p style={{color: 'var(--dorado)'}}>Administración del Patrimonio Cultural de La Paz</p>
            </div>

            <div className="admin-card-form">
                <h2>{editId ? 'Modificar Sitio' : 'Añadir Nuevo Espacio'}</h2>
                <form onSubmit={handleSubmit}>
                    <input name="nombre" placeholder="Nombre del Museo o Teatro" value={form.nombre} onChange={(e) => setForm({...form, nombre: e.target.value})} required />
                    <input name="direccion" placeholder="Ubicación / Dirección" value={form.direccion} onChange={(e) => setForm({...form, direccion: e.target.value})} required />
                    <input name="imagen_url" placeholder="URL de la Imagen (Link)" value={form.imagen_url} onChange={(e) => setForm({...form, imagen_url: e.target.value})} />
                    
                    <select value={form.id_categoria} onChange={(e) => setForm({...form, id_categoria: e.target.value})}>
                        <option value="1">🏛️ Museo</option>
                        <option value="2">🎭 Teatro</option>
                    </select>

                    <textarea name="descripcion" placeholder="Descripción detallada del sitio..." rows="4" value={form.descripcion} onChange={(e) => setForm({...form, descripcion: e.target.value})} required></textarea>
                    
                    <button type="submit" className="btn-gold">
                        {editId ? 'Confirmar Cambios en PostgreSQL' : 'Registrar en cultura_lapaz'}
                    </button>
                    {editId && <button onClick={() => setEditId(null)} className="btn-action" style={{marginTop:'10px', background:'#555', color:'white', width:'100%'}}>Cancelar Modificación</button>}
                </form>
            </div>

            <div className="grid">
                {sitios.map(s => (
                    <div className="card-item" key={s.id_sitio_cultural}>
                        <img src={s.imagen_url || 'https://via.placeholder.com/400x220'} className="card-img" alt={s.nombre} />
                        <div className="card-info">
                            <h3>{s.nombre}</h3>
                            <p>{s.descripcion.substring(0, 100)}...</p>
                            <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                <button onClick={() => iniciarEdicion(s)} className="btn-action btn-edit">MODIFICAR</button>
                                <button onClick={() => eliminar(s.id_sitio_cultural)} className="btn-action btn-delete">ELIMINAR</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Admin;