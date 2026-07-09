import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUniversalAccess } from '@fortawesome/free-solid-svg-icons';
import './AccessibilityWidget.css';

export default function AccessibilityWidget() {
  const [panelAbierto, setPanelAbierto] = useState(false);
  const [scale, setScale] = useState('normal'); // 'small' | 'normal' | 'large' | 'xlarge'
  const [altoContraste, setAltoContraste] = useState(false);
  const [monocromo, setMonocromo] = useState(false);
  const [subrayarEnlaces, setSubrayarEnlaces] = useState(false);

  // Cargar preferencias iniciales al montar
  useEffect(() => {
    const savedScale = localStorage.getItem('access_scale') || 'normal';
    const savedContrast = localStorage.getItem('access_contrast') === 'true';
    const savedMono = localStorage.getItem('access_mono') === 'true';
    const savedUnderline = localStorage.getItem('access_underline') === 'true';

    setScale(savedScale);
    setAltoContraste(savedContrast);
    setMonocromo(savedMono);
    setSubrayarEnlaces(savedUnderline);

    aplicarClases(savedScale, savedContrast, savedMono, savedUnderline);
  }, []);

  const aplicarClases = (currScale, currContrast, currMono, currUnderline) => {
    // Escala de texto
    document.body.classList.remove('scale-small', 'scale-large', 'scale-xlarge');
    if (currScale === 'small') document.body.classList.add('scale-small');
    else if (currScale === 'large') document.body.classList.add('scale-large');
    else if (currScale === 'xlarge') document.body.classList.add('scale-xlarge');

    // Alto Contraste
    if (currContrast) document.body.classList.add('alto-contraste');
    else document.body.classList.remove('alto-contraste');

    // Monocromo
    if (currMono) document.body.classList.add('monocromo');
    else document.body.classList.remove('monocromo');

    // Subrayar Enlaces
    if (currUnderline) document.body.classList.add('subrayar-enlaces');
    else document.body.classList.remove('subrayar-enlaces');
  };

  const cambiarEscala = (nuevaEscala) => {
    setScale(nuevaEscala);
    localStorage.setItem('access_scale', nuevaEscala);
    aplicarClases(nuevaEscala, altoContraste, monocromo, subrayarEnlaces);
  };

  const toggleContrast = () => {
    const val = !altoContraste;
    setAltoContraste(val);
    localStorage.setItem('access_contrast', val);
    aplicarClases(scale, val, monocromo, subrayarEnlaces);
  };

  const toggleMono = () => {
    const val = !monocromo;
    setMonocromo(val);
    localStorage.setItem('access_mono', val);
    aplicarClases(scale, altoContraste, val, subrayarEnlaces);
  };

  const toggleUnderline = () => {
    const val = !subrayarEnlaces;
    setSubrayarEnlaces(val);
    localStorage.setItem('access_underline', val);
    aplicarClases(scale, altoContraste, monocromo, val);
  };

  const restablecerTodo = () => {
    setScale('normal');
    setAltoContraste(false);
    setMonocromo(false);
    setSubrayarEnlaces(false);

    localStorage.setItem('access_scale', 'normal');
    localStorage.setItem('access_contrast', 'false');
    localStorage.setItem('access_mono', 'false');
    localStorage.setItem('access_underline', 'false');

    aplicarClases('normal', false, false, false);
  };

  return (
    <div className="accesibilidad-widget">
      {/* Botón flotante accesible */}
      <button
        className="btn-flotante-accesibilidad"
        onClick={() => setPanelAbierto(!panelAbierto)}
        aria-label={panelAbierto ? "Cerrar menú de accesibilidad" : "Abrir opciones de accesibilidad"}
        aria-expanded={panelAbierto}
        type="button"
      >
        <FontAwesomeIcon icon={faUniversalAccess} aria-hidden="true" />
      </button>

      {panelAbierto && (
        <div 
          className="panel-accesibilidad"
          role="dialog"
          aria-modal="true"
          aria-labelledby="panel-titulo"
        >
          <div className="panel-header">
            <h3 id="panel-titulo">Ajustes de Accesibilidad</h3>
            <button
              className="btn-cerrar-panel"
              onClick={() => setPanelAbierto(false)}
              aria-label="Cerrar panel de accesibilidad"
              type="button"
            >
              ✕
            </button>
          </div>

          <div className="panel-body">
            {/* Control de tamaño de texto */}
            <div className="control-grupo">
              <h4>Tamaño de Interfaz</h4>
              <div className="botones-control">
                <button
                  type="button"
                  onClick={() => cambiarEscala('small')}
                  className={scale === 'small' ? 'activo' : ''}
                  aria-pressed={scale === 'small'}
                >
                  A-
                </button>
                <button
                  type="button"
                  onClick={() => cambiarEscala('normal')}
                  className={scale === 'normal' ? 'activo' : ''}
                  aria-pressed={scale === 'normal'}
                >
                  Normal
                </button>
                <button
                  type="button"
                  onClick={() => cambiarEscala('large')}
                  className={scale === 'large' ? 'activo' : ''}
                  aria-pressed={scale === 'large'}
                >
                  A+
                </button>
                <button
                  type="button"
                  onClick={() => cambiarEscala('xlarge')}
                  className={scale === 'xlarge' ? 'activo' : ''}
                  aria-pressed={scale === 'xlarge'}
                >
                  A++
                </button>
              </div>
            </div>

            {/* Opciones visuales */}
            <div className="control-grupo">
              <h4>Herramientas Visuales</h4>
              <div className="botones-opciones">
                <button
                  type="button"
                  className={`btn-toggle-option ${altoContraste ? 'activo' : ''}`}
                  onClick={toggleContrast}
                  aria-pressed={altoContraste}
                >
                  🌓 Alto Contraste
                </button>
                <button
                  type="button"
                  className={`btn-toggle-option ${monocromo ? 'activo' : ''}`}
                  onClick={toggleMono}
                  aria-pressed={monocromo}
                >
                  ⚫ Escala de Grises
                </button>
                <button
                  type="button"
                  className={`btn-toggle-option ${subrayarEnlaces ? 'activo' : ''}`}
                  onClick={toggleUnderline}
                  aria-pressed={subrayarEnlaces}
                >
                  🔗 Subrayar Enlaces
                </button>
              </div>
            </div>

            {/* Restablecer ajustes */}
            <button
              className="btn-restablecer-accesibilidad"
              onClick={restablecerTodo}
              type="button"
            >
              Restablecer todo
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
