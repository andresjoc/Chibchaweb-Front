import React, { useState, useEffect } from 'react';
import { useLanguage } from '../Context/LanguageContext';
import './AccessibilityWidget.css';

export default function AccessibilityWidget() {
  const [panelAbierto, setPanelAbierto] = useState(false);
  const { idioma, cambiarIdioma } = useLanguage();
  const [tamanio, setTamanio] = useState(100);

  useEffect(() => {
    const savedSize = localStorage.getItem('fontSizePct');
    if (savedSize) {
      const sizeNum = Number(savedSize);
      setTamanio(sizeNum);
      document.documentElement.style.fontSize = `${sizeNum}%`;
    }
  }, []);

  const cambiarTamanioTexto = (accion) => {
    let nuevoTamanio = 100;
    if (accion === 'aumentar') {
      nuevoTamanio = Math.min(tamanio + 10, 140);
    } else if (accion === 'disminuir') {
      nuevoTamanio = Math.max(tamanio - 10, 80);
    }
    setTamanio(nuevoTamanio);
    document.documentElement.style.fontSize = `${nuevoTamanio}%`;
    localStorage.setItem('fontSizePct', nuevoTamanio);
  };

  const togglePanel = () => {
    setPanelAbierto(!panelAbierto);
  };

  return (
    <div className="accesibilidad-widget">
      {/* Botón flotante accesible */}
      <button
        className="btn-flotante-accesibilidad"
        onClick={togglePanel}
        aria-label={panelAbierto ? "Cerrar menú de accesibilidad" : "Abrir opciones de accesibilidad"}
        aria-expanded={panelAbierto}
        type="button"
      >
        ♿
      </button>

      {panelAbierto && (
        <div 
          className="panel-accesibilidad"
          role="dialog"
          aria-modal="true"
          aria-labelledby="panel-titulo"
        >
          <div className="panel-header">
            <h3 id="panel-titulo">
              {idioma === 'es' ? 'Opciones de Accesibilidad' : 'Accessibility Options'}
            </h3>
            <button
              className="btn-cerrar-panel"
              onClick={() => setPanelAbierto(false)}
              aria-label={idioma === 'es' ? 'Cerrar panel' : 'Close panel'}
              type="button"
            >
              ✕
            </button>
          </div>

          <div className="panel-body">
            {/* Control de tamaño de texto */}
            <div className="control-grupo">
              <h4>{idioma === 'es' ? 'Tamaño del texto' : 'Text size'}</h4>
              <div className="botones-control">
                <button
                  type="button"
                  onClick={() => cambiarTamanioTexto('disminuir')}
                  aria-label={idioma === 'es' ? 'Disminuir tamaño del texto' : 'Decrease text size'}
                  title={idioma === 'es' ? 'Disminuir tamaño' : 'Decrease size'}
                >
                  A-
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTamanio(100);
                    document.documentElement.style.fontSize = '100%';
                    localStorage.setItem('fontSizePct', 100);
                  }}
                  aria-label={idioma === 'es' ? 'Restablecer tamaño del texto' : 'Reset text size'}
                  title={idioma === 'es' ? 'Restablecer tamaño' : 'Reset size'}
                >
                  A
                </button>
                <button
                  type="button"
                  onClick={() => cambiarTamanioTexto('aumentar')}
                  aria-label={idioma === 'es' ? 'Aumentar tamaño del texto' : 'Increase text size'}
                  title={idioma === 'es' ? 'Aumentar tamaño' : 'Increase size'}
                >
                  A+
                </button>
              </div>
              <small className="tamanio-actual">
                {idioma === 'es' ? 'Escala actual:' : 'Current scale:'} {tamanio}%
              </small>
            </div>

            {/* Control de idioma */}
            <div className="control-grupo">
              <h4>{idioma === 'es' ? 'Idioma de lectura' : 'Language'}</h4>
              <div className="botones-control">
                <button
                  type="button"
                  onClick={() => cambiarIdioma('es')}
                  className={idioma === 'es' ? 'activo' : ''}
                  aria-pressed={idioma === 'es'}
                >
                  Español
                </button>
                <button
                  type="button"
                  onClick={() => cambiarIdioma('en')}
                  className={idioma === 'en' ? 'activo' : ''}
                  aria-pressed={idioma === 'en'}
                >
                  English
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
