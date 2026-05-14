import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Admin = () => {
    const [sitios, setSitios] = useState([]);
    const [form, setForm] = useState({ nombre: '', descripcion: '', direccion: '', id_categoria: 1, imagen_url: '' });
    const [editId, setEditId] = useState(null);
    const navigate = useNavigate();
    
    // Verificamos si existe la sesión activa
    const isAuthenticated = localStorage.getItem('session_token') === 'active_admin';

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login'); // Si no hay login, te saca de aquí
        } else {
            cargarDatos();
        }
    }, [isAuthenticated, navigate]);

    const cargarDatos = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/sitios');
            const data = await res.json();
            setSitios(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Error al conectar con PostgreSQL");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const url = editId ? `http://localhost:5000/api/sitios/${editId}` : 'http://localhost:5000/api/sitios';
        const method = editId ? 'PUT' : 'POST';

        const res = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form)
        });

        if (res.ok) {
            setEditId(null);
            setForm({ nombre: '', descripcion: '', direccion: '', id_categoria: 1, imagen_url: '' });
            cargarDatos();
            alert("¡Guardado en PostgreSQL exitosamente!");
        }
    };

    const eliminar = async (id) => {
        if (window.confirm("¿Estás seguro de eliminar este registro permanentemente?")) {
            await fetch(`http://localhost:5000/api/sitios/${id}`, { method: 'DELETE' });
            cargarDatos();
        }
    };

    const prepararEdicion = (s) => {
        setEditId(s.id_sitio_cultural);
        setForm(s);
        window.scrollTo(0, 0);
    };

    const cerrarSesion = () => {
        localStorage.removeItem('session_token');
        navigate('/login');
    };

    if (!isAuthenticated) return null;

    return (
        <div className="container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                <h1 style={{ fontFamily: 'Playfair Display, serif', color: 'var(--primary-color)' }}>Administración de Sitios</h1>
                <button onClick={cerrarSesion} className="btn-main" style={{ background: 'var(--accent-coral)', border: 'none', width: 'auto' }}>
                    CERRAR SESIÓN
                </button>
            </div>

            {/* FORMULARIO DE GESTIÓN */}
            <div className="card" style={{ padding: '35px', marginBottom: '40px', background: 'white' }}>
                <h3 style={{color: 'var(--accent-gold)', marginBottom: '20px'}}>{editId ? '📝 Editando Registro' : '➕ Nuevo Registro'}</h3>
                <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '20px' }}>
                    <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px'}}>
                        <input className="admin-input" placeholder="Nombre" value={form.nombre} onChange={e => setForm({...form, nombre: e.target.value})} required />
                        <input className="admin-input" placeholder="Dirección" value={form.direccion} onChange={e => setForm({...form, direccion: e.target.value})} required />
                    </div>
                    <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px'}}>
                        <input className="admin-input" placeholder="URL de la imagen" value={form.imagen_url} onChange={e => setForm({...form, imagen_url: e.target.value})} />
                        <select className="admin-input" value={form.id_categoria} onChange={e => setForm({...form, id_categoria: parseInt(e.target.value)})}>
                            <option value="1">🏛️ Museo</option>
                            <option value="2">🎭 Teatro</option>
                        </select>
                    </div>
                    <textarea className="admin-input" placeholder="Descripción detallada..." value={form.descripcion} onChange={e => setForm({...form, descripcion: e.target.value})} required rows="4" />
                    <button className="btn-main" type="submit" style={{ border: 'none' }}>
                        {editId ? 'GUARDAR CAMBIOS' : 'GUARDAR EN POSTGRESQL'}
                    </button>
                </form>
            </div>

            {/* LISTA DE REGISTROS CON ACCIONES */}
            <div className="card" style={{ padding: '0', overflow: 'hidden', background: 'white' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead style={{ background: 'var(--primary-color)', color: 'white' }}>
                        <tr>
                            <th style={{ padding: '15px', textAlign: 'left' }}>Nombre del Espacio</th>
                            <th style={{ padding: '15px', textAlign: 'center' }}>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sitios.map(s => (
                            <tr key={s.id_sitio_cultural} style={{ borderBottom: '1px solid #eee' }}>
                                <td style={{ padding: '15px' }}>{s.nombre}</td>
                                <td style={{ padding: '15px', textAlign: 'center' }}>
                                    <button onClick={() => prepararEdicion(s)} 
                                            style={{ color: 'var(--accent-gold)', background: 'none', border: 'none', cursor: 'pointer', marginRight: '20px', fontWeight: 'bold' }}>MODIFICAR</button>
                                    <button onClick={() => eliminar(s.id_sitio_cultural)} 
                                            style={{ color: 'var(--accent-coral)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>ELIMINAR</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Admin;