import React from 'react';
import './Contacto.css';

export default function Contacto() {
  return (
    <div className="contacto-container">
      <h2>Centro de Ayuda</h2>
      <p className="subtexto">
        ¿Tienes dudas sobre el funcionamiento de la plataforma? Aquí te indicamos cómo contactarnos:
      </p>

      <div className="info-grid">
        <div className="info-card">
          <span className="icono" aria-hidden="true">📨</span>
          <h3>Soporte por Ticket</h3>
          <p>Envía una solicitud desde la sección de soporte técnico y recibe una respuesta personalizada.</p>
        </div>

        <div className="info-card">
          <span className="icono" aria-hidden="true">📧</span>
          <h3>Correo de Soporte</h3>
          <p>chibchawebcom@gmail.com</p>
        </div>
      </div>
    </div>
  );
}
