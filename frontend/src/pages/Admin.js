import React, { useState, useEffect } from 'react';

const Admin = () => {
    const [sitios, setSitios] = useState([]);
    const [form, setForm] = useState({ nombre: '', descripcion: '', direccion: '', id_categoria: 1, imagen_url: '' });
    const [editId, setEditId] = useState(null);

    useEffect(() => { cargarDatos(); }, []);

    const cargarDatos = async () => {
        const res = await fetch('http://localhost:5000/api/sitios');
        const data = await res.json();
        setSitios(data);
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
        }
    };

    const eliminar = async (id) => {
        if (window.confirm("¿Deseas eliminar este registro?")) {
            await fetch(`http://localhost:5000/api/sitios/${id}`, { method: 'DELETE' });
            cargarDatos();
        }
    };

    const prepararEdicion = (s) => {
        setEditId(s.id_sitio_cultural);
        setForm({ nombre: s.nombre, descripcion: s.descripcion, direccion: s.direccion, id_categoria: s.id_categoria, imagen_url: s.imagen_url });
        window.scrollTo(0, 0);
    };

    return (
        <div className="container">
            <h1 className="header-title">Administración Cultural</h1>
            
            <div className="admin-form">
                <h3 style={{marginBottom: '15px', color: 'var(--accent-gold)'}}>
                    {editId ? 'Modificar Sitio' : 'Registrar Nuevo Sitio'}
                </h3>
                <form onSubmit={handleSubmit}>
                    <input placeholder="Nombre del sitio" value={form.nombre} onChange={e => setForm({...form, nombre: e.target.value})} required />
                    <input placeholder="Dirección" value={form.direccion} onChange={e => setForm({...form, direccion: e.target.value})} required />
                    <input placeholder="URL de la Imagen" value={form.imagen_url} onChange={e => setForm({...form, imagen_url: e.target.value})} />
                    <textarea placeholder="Descripción" rows="3" value={form.descripcion} onChange={e => setForm({...form, descripcion: e.target.value})} required />
                    <button type="submit" className="btn btn-submit">
                        {editId ? 'ACTUALIZAR DATOS' : 'GUARDAR EN POSTGRESQL'}
                    </button>
                </form>
            </div>

            <div className="grid">
                {sitios.map(s => (
                    <div className="card" key={s.id_sitio_cultural}>
                        <img src={s.imagen_url || 'https://via.placeholder.com/400x200'} className="card-img" alt={s.nombre} />
                        <div className="card-content">
                            <div className="card-title">{s.nombre}</div>
                            <p className="card-desc">{s.descripcion.substring(0, 100)}...</p>
                            <div className="card-info">📍 {s.direccion}</div>
                            <div className="btn-group">
                                <button onClick={() => prepararEdicion(s)} className="btn btn-edit">Modificar</button>
                                <button onClick={() => eliminar(s.id_sitio_cultural)} className="btn btn-delete">Eliminar</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Admin;