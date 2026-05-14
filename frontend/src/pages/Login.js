import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [user, setUser] = useState('');
    const [pass, setPass] = useState('');
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        
        // --- CREDENCIALES SOLICITADAS ---
        if (user === 'juandaniel' && pass === '19992026') {
            localStorage.setItem('session_token', 'active_admin');
            navigate('/admin'); // Entra al panel
        } else {
            alert("Error: Usuario o contraseña incorrectos.");
        }
    };

    return (
        <div className="container" style={{ display: 'flex', justifyContent: 'center', marginTop: '100px' }}>
            <div className="card" style={{ padding: '50px', width: '100%', maxWidth: '400px', textAlign: 'center', background: 'white' }}>
                <h2 style={{ color: 'var(--primary-color)', marginBottom: '10px', fontFamily: 'Playfair Display, serif' }}>Iniciar Sesión</h2>
                <p style={{ color: 'var(--accent-gold)', marginBottom: '30px', fontSize: '0.8rem', fontWeight: 'bold' }}>PANEL DE ADMINISTRACIÓN</p>
                
                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <input className="admin-input" type="text" placeholder="Usuario" 
                           onChange={e => setUser(e.target.value)} required />
                    
                    <input className="admin-input" type="password" placeholder="Contraseña" 
                           onChange={e => setPass(e.target.value)} required />

                    <button className="btn-main" type="submit" style={{ border: 'none', cursor: 'pointer' }}>
                        INGRESAR
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;