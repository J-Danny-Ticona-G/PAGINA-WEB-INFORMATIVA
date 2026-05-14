import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <nav className="navbar">
            <div className="nav-logo">CULTURA LA PAZ</div>
            <ul className="nav-links">
                <li><Link to="/">INICIO</Link></li>
                <li><Link to="/museos">MUSEOS</Link></li>
                <li><Link to="/teatros">TEATROS</Link></li>
                <li><Link to="/contacto">CONTACTO</Link></li>
                <li><Link to="/admin" style={{color: '#d4af37', border: '1px solid #d4af37', padding: '5px 10px', borderRadius: '5px'}}>ADMIN</Link></li>
            </ul>
        </nav>
    );
};

export default Navbar;