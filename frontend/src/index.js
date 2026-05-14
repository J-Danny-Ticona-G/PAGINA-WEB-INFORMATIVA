import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Creamos la raíz del DOM donde se montará la aplicación de React
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    {/* App contiene toda la lógica de rutas y estado global */}
    <App />
  </React.StrictMode>
);