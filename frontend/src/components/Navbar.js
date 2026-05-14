import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <header className="main-header">
            <div className="logo">Cultura La Paz</div>
            <nav>
                <ul className="nav-links">
                    <li><Link to="/">Inicio</Link></li>
                    <li><Link to="/museos">Museos</Link></li>
                    <li><Link to="/teatros">Teatros</Link></li>
                    <li><Link to="/contacto">Contacto</Link></li>
                </ul>
            </nav>
        </header>
    );
};

export default Navbar;