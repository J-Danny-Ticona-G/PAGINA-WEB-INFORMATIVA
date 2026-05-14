import React, { useState } from 'react';

const Admin = () => {
    const [form, setForm] = useState({ 
        nombre: '', 
        descripcion: '', 
        direccion: '', 
        id_categoria: 1, 
        imagen_url: '' 
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            // Llamada real al servidor local
            const response = await fetch('http://localhost:5000/api/sitios', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(form)
            });

            if (response.ok) {
                const data = await response.json();
                alert(`✅ Éxito: "${data.nombre}" se guardó en cultura_lapaz`);
                // Limpiar formulario
                setForm({ nombre: '', descripcion: '', direccion: '', id_categoria: 1, imagen_url: '' });
                window.location.reload(); 
            } else {
                const errorData = await response.json();
                alert("❌ Error del servidor: " + errorData.error);
            }
        } catch (error) {
            console.error("Error al conectar:", error);
            alert("❌ Error: No se pudo conectar con el servidor. ¿Está encendido el Backend?");
        }
    };

    return (
        <div className="container">
            <header style={{ marginBottom: '50px' }}>
                <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '3rem', color: 'var(--primary-color)' }}>Panel de Control</h1>
            </header>

            <div className="card" style={{ padding: '40px', background: 'white' }}>
                <h2 style={{ marginBottom: '30px', color: 'var(--primary-color)' }}>Añadir Nuevo Espacio</h2>
                <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '20px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        <input className="admin-input" placeholder="Nombre del Sitio" value={form.nombre} 
                               onChange={(e) => setForm({...form, nombre: e.target.value})} required />
                        <input className="admin-input" placeholder="Ubicación / Dirección" value={form.direccion} 
                               onChange={(e) => setForm({...form, direccion: e.target.value})} required />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        <input className="admin-input" placeholder="URL Imagen" value={form.imagen_url} 
                               onChange={(e) => setForm({...form, imagen_url: e.target.value})} />
                        <select className="admin-input" value={form.id_categoria} 
                                onChange={(e) => setForm({...form, id_categoria: parseInt(e.target.value)})}>
                            <option value="1">Museo</option>
                            <option value="2">Teatro</option>
                        </select>
                    </div>
                    <textarea className="admin-input" placeholder="Descripción..." rows="4" value={form.descripcion} 
                              onChange={(e) => setForm({...form, descripcion: e.target.value})} required />
                    
                    <button type="submit" className="btn-main" style={{ border: 'none', cursor: 'pointer' }}>
                        Registrar en cultura_lapaz
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Admin;