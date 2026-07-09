import { useEffect, useState } from 'react';
import { useUser } from '../Context/UserContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faGlobe, 
  faLock, 
  faArrowRightArrowLeft, 
  faPaperPlane, 
  faCircleExclamation, 
  faCircleCheck 
} from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import './DominiosAdquiridos.css';

function DominiosAdquiridos() {
  const { usuario } = useUser();
  const [dominios, setDominios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [dominioSeleccionado, setDominioSeleccionado] = useState(null);
  const [correoDestino, setCorreoDestino] = useState("");
  const [errorTransferencia, setErrorTransferencia] = useState("");

  const cargarDominios = async () => {
    if (!usuario?.idcuenta) return;
    setCargando(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/dominios/vigencia?idcuenta=${encodeURIComponent(String(usuario.idcuenta))}`,
        {
          headers: {
            "Chibcha-api-key": import.meta.env.VITE_API_KEY,
          },
        }
      );
      if (res.status === 404) {
        const texto = await res.text();
        const json = JSON.parse(texto);
        if (json?.detail?.includes("No se encontraron dominios")) {
          setDominios([]);
          setError("");
          return;
        } else {
          throw new Error(`(404) ${texto}`);
        }
      }
      if (!res.ok) {
        const texto = await res.text();
        throw new Error(`(${res.status}) ${texto}`);
      }
      const data = await res.json();
      if (Array.isArray(data)) {
        setDominios(
          data.map((d) => ({
            nombre: d.nombre_dominio,
            diasRestantes: d.dias_restantes,
          }))
        );
      } else {
        setDominios([]);
      }
    } catch (err) {
      console.error("❌ Error al cargar dominios:", err);
      if (err instanceof Error) {
        setError("❌ Error al cargar dominios: " + err.message);
      } else {
        setError("❌ Error al cargar dominios");
      }
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarDominios();
  }, [usuario]);

  const manejarTransferencia = async () => {
    if (!correoDestino || errorTransferencia) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/TransferenciaDominio`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Chibcha-api-key": import.meta.env.VITE_API_KEY,
        },
        body: JSON.stringify({
          iddominio: dominioSeleccionado,
          idcuenta_origen: usuario.idcuenta,
          correo_destino: correoDestino,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data?.detail === "Cuenta de destino no encontrada") {
          setErrorTransferencia("El correo no está asociado a ninguna cuenta.");
        } else {
          setErrorTransferencia("Ocurrió un error al transferir el dominio.");
        }
        return;
      }
      alert(`✅ Dominio "${dominioSeleccionado}" transferido a ${correoDestino}`);
      setCorreoDestino("");
      setDominioSeleccionado(null);
      setErrorTransferencia("");
      cargarDominios();
    } catch (error) {
      console.error("❌ Error al transferir:", error);
      setErrorTransferencia("Error inesperado al transferir el dominio.");
    }
  };

  return (
    <main className="mis-dominios">
      <div className="cabecera-dominios">
        <h1 className="titulo-dominios">
          <FontAwesomeIcon icon={faGlobe} className="icono-titulo-dominios" aria-hidden="true" />
          Mis Dominios
          <span className="badge-items">{dominios.length}</span>
        </h1>
        <p className="subtexto-dominios">Seleccione un dominio si desea transferirlo a otra cuenta</p>
      </div>

      <div className="linea-separadora" />

      {cargando ? (
        <p>Cargando dominios...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : dominios.length === 0 ? (
        <div className="dominios-vacio-contenedor">
          <FontAwesomeIcon icon={faGlobe} className="icono-vacio" aria-hidden="true" />
          <h2>No tienes dominios registrados</h2>
          <p>¡Busca tu nombre de dominio ideal o genéralo con Inteligencia Artificial!</p>
          <Link to="/dominios" className="btn-ir-buscar">
            Buscar dominios
          </Link>
        </div>
      ) : (
        <div className="lista-dominios">
          {dominios.map((dom, index) => {
            // Determinar tipo de badge según vigencia
            let estadoClase = "activo";
            let estadoTexto = "Activo";
            if (dom.diasRestantes <= 0) {
              estadoClase = "vencido";
              estadoTexto = "Vencido";
            } else if (dom.diasRestantes <= 30) {
              estadoClase = "aviso";
              estadoTexto = "Próximo a vencer";
            }

            return (
              <div
                key={index}
                className="dominio-item"
                role="button"
                tabIndex={0}
                aria-haspopup="dialog"
                aria-label={`Transferir dominio ${dom.nombre}`}
                onClick={() => {
                  setDominioSeleccionado(dom.nombre);
                  setCorreoDestino("");
                  setErrorTransferencia("");
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setDominioSeleccionado(dom.nombre);
                    setCorreoDestino("");
                    setErrorTransferencia("");
                  }
                }}
                style={{ cursor: 'pointer' }}
              >
                <div className="bloque-izquierdo">
                  <FontAwesomeIcon icon={faGlobe} className="icono-item-dominio" aria-hidden="true" />
                  <div className="nombre-y-badge">
                    <span className="nombre">{dom.nombre}</span>
                    <span className={`badge-estado ${estadoClase}`}>{estadoTexto}</span>
                  </div>
                </div>

                <div className="bloque-derecho">
                  <span className="vence">
                    {dom.diasRestantes > 0 ? `Vence en: ${dom.diasRestantes} día(s)` : "Dominio vencido"}
                  </span>
                  <span className="transfer-hint">
                    Transferir <FontAwesomeIcon icon={faArrowRightArrowLeft} aria-hidden="true" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {dominioSeleccionado && (
        <div 
          className="modal-overlay"
          onClick={() => {
            setDominioSeleccionado(null);
            setCorreoDestino("");
            setErrorTransferencia("");
          }}
        >
          <div 
            className="modal-contenido"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-titulo"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                setDominioSeleccionado(null);
                setCorreoDestino("");
                setErrorTransferencia("");
              }
            }}
          >
            <h2 id="modal-titulo">Transferir dominio</h2>
            <div className="dominio-transferencia">
              <FontAwesomeIcon icon={faGlobe} className="icono-transfer" aria-hidden="true" />
              <span>{dominioSeleccionado}</span>
            </div>
            
            <div className="grupo-input">
              <label htmlFor="transfer-email">Correo de la cuenta destino:</label>
              <div className="input-con-icono">
                <input
                  id="transfer-email"
                  type="email"
                  placeholder="correo@ejemplo.com"
                  value={correoDestino}
                  onChange={(e) => {
                    const valor = e.target.value;
                    setCorreoDestino(valor);
                    if (!valor) {
                      setErrorTransferencia("Ingresa un correo electrónico.");
                    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor)) {
                      setErrorTransferencia("Revisa que el correo esté bien escrito.");
                    } else {
                      setErrorTransferencia("");
                    }
                  }}
                  className={errorTransferencia ? "input-error" : ""}
                />
              </div>
              {errorTransferencia && (
                <div className="error-box">
                  <FontAwesomeIcon icon={faCircleExclamation} aria-hidden="true" />
                  <span>{errorTransferencia}</span>
                </div>
              )}
            </div>
            
            <div className="grupo-botones">
              <button
                type="button"
                onClick={manejarTransferencia}
                disabled={!!errorTransferencia || !correoDestino}
              >
                <FontAwesomeIcon icon={faPaperPlane} className="btn-icon" aria-hidden="true" />
                Transferir
              </button>
              <button
                type="button"
                className="cancelar"
                onClick={() => {
                  setDominioSeleccionado(null);
                  setCorreoDestino("");
                  setErrorTransferencia("");
                }}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default DominiosAdquiridos;
