import React, { useState } from 'react';

const Admin = ({ sitios, setSitios }) => {
    const [form, setForm] = useState({ nombre: '', descripcion: '', direccion: '', id_categoria: 1, imagen_url: '' });
    const [editId, setEditId] = useState(null);

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
            // Aquí llamarías a cargarDatos() si lo pasaras por props, o refrescarías
            window.location.reload(); 
        }
    };

    return (
        <div className="container">
            <header style={{ marginBottom: '50px' }}>
                <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '3rem', color: 'var(--primary-color)' }}>Panel de Control</h1>
                <p style={{ color: 'var(--accent-gold)', fontWeight: 'bold' }}>Administración del Patrimonio de La Paz</p>
            </header>

            <div className="card" style={{ padding: '40px', marginBottom: '60px' }}>
                <h2 style={{ marginBottom: '30px', color: 'var(--primary-color)' }}>{editId ? 'Editar Espacio' : 'Añadir Nuevo Espacio'}</h2>
                <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '20px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        <input className="admin-input" placeholder="Nombre del Sitio" value={form.nombre} onChange={(e) => setForm({...form, nombre: e.target.value})} required />
                        <input className="admin-input" placeholder="Ubicación / Dirección" value={form.direccion} onChange={(e) => setForm({...form, direccion: e.target.value})} required />
                    </div>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        <input className="admin-input" placeholder="URL de la Imagen" value={form.imagen_url} onChange={(e) => setForm({...form, imagen_url: e.target.value})} />
                        <select className="admin-input" value={form.id_categoria} onChange={(e) => setForm({...form, id_categoria: e.target.value})}>
                            <option value="1">Museo</option>
                            <option value="2">Teatro</option>
                        </select>
                    </div>

                    <textarea className="admin-input" placeholder="Descripción detallada..." rows="4" value={form.descripcion} onChange={(e) => setForm({...form, descripcion: e.target.value})} required></textarea>
                    
                    <button type="submit" className="btn-main" style={{ border: 'none', cursor: 'pointer' }}>
                        {editId ? 'Guardar Cambios' : 'Registrar en cultura_lapaz'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Admin;