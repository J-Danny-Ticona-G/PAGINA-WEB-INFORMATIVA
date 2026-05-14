import React from 'react';

const Footer = () => {
    return (
        <footer className="main-footer">
            <div className="footer-links">
                <a href="/">Privacidad</a>
                <a href="/">Términos de Uso</a>
                {/* Enlace oficial a tu universidad */}
                <a 
                    href="https://www.usalesiana.edu.bo/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                >
                    Universidad Salesiana
                </a>
            </div>
            <div className="footer-bottom">
                <p>© 2026 Plataforma de Gestión Cultural - Juan Daniel Ticona Gutierrez</p>
            </div>
        </footer>
    );
};

export default Footer;