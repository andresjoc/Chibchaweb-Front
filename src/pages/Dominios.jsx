import { useEffect, useState } from 'react';
import './Dominios.css';
import Loader from "../Components/Loader";
import { useLocation } from 'react-router-dom';
import { useUser } from "../Context/UserContext";
import { usePreciosExtensiones } from "../Context/ExtensionContext";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWandMagicSparkles } from '@fortawesome/free-solid-svg-icons';

function Dominios() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const dominioInicial = queryParams.get('nombre') || '';
  const tipoInicial = queryParams.get('tipo') || 'normal';
  const { usuario } = useUser();

  const [input, setInput] = useState(dominioInicial);
  const [dominio, setDominio] = useState('');
  const [tipoBusqueda, setTipoBusqueda] = useState(tipoInicial);
  const [buscando, setBuscando] = useState(false);
  const [buscado, setBuscado] = useState(false);
  const [resultados, setResultados] = useState([]);
  const [principalDisponible, setPrincipalDisponible] = useState(false);
  const [mostrarPrincipal, setMostrarPrincipal] = useState(true);
  const [error, setError] = useState('');
  const [dominiosAgregados, setDominiosAgregados] = useState(new Set());

  const { precios } = usePreciosExtensiones();
  const EXTENSIONS = Object.keys(precios);

  useEffect(() => {
    if (dominioInicial) {
      setInput(dominioInicial);
      manejarBusqueda(dominioInicial, tipoInicial);
    }
  }, [dominioInicial, tipoInicial]);

  const obtenerDominiosEnCarrito = async () => {
    if (!usuario || !usuario.idcuenta) return new Set();
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/carrito/dominios?idcuenta=${usuario.idcuenta}`, {
        headers: { 'Chibcha-api-key': import.meta.env.VITE_API_KEY },
      });
      if (!res.ok) return new Set();
      const datos = await res.json();
      return new Set(datos.map(d => d.dominio));
    } catch {
      return new Set();
    }
  };

  const manejarBusqueda = async (valorManual = null, tipo = 'normal') => {
    let nombre = (valorManual ?? input).trim().toLowerCase();
    if (nombre.endsWith('.')) nombre = nombre.slice(0, -1);

    if (!nombre) {
      setError('Por favor, escribe un nombre de dominio antes de buscar.');
      setBuscando(false);
      setBuscado(false);
      return;
    }

    setError('');
    setBuscando(true);
    setBuscado(false);
    setResultados([]);
    setPrincipalDisponible(false);
    setMostrarPrincipal(true);
    setDominiosAgregados(new Set());

    const dominiosEnCarrito = await obtenerDominiosEnCarrito();

    try {
      if (tipo === 'ia') {
        const resIA = await fetch(`${import.meta.env.VITE_API_URL}/generar-dominiosIA`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Chibcha-api-key': import.meta.env.VITE_API_KEY
          },
          body: JSON.stringify({ descripcion: nombre })
        });

        if (!resIA.ok) {
          const errorData = await resIA.json();
          setError(errorData?.detail || 'Ocurrió un error al generar dominios.');
          setBuscando(false);
          return;
        }

        const dataIA = await resIA.json();

        // ❌ Filtrar cualquier elemento que no parezca un dominio válido .com
        const dominiosFiltrados = (dataIA.dominios_generados || []).filter(dom =>
          typeof dom === 'string' && dom.includes('.') && /^[a-zA-Z0-9\-]+\.[a-z]{2,}$/.test(dom)
        );

        // 🟤 Remueve duplicados y cosas como el mensaje introductorio de la IA
        const únicos = Array.from(new Set(dominiosFiltrados));

        // 🔸 Obtener dominios no repetidos y no presentes en el carrito
        const disponibles = únicos.filter(dom => !dominiosEnCarrito.has(dom));

        const conPrecios = disponibles.map((dom) => ({
          id: dom,
          nombre: dom,
          precio: precios[dom.split('.').pop()] ?? 10000,
        }));

        if (conPrecios.length > 0) {
          setDominio(conPrecios[0].nombre);
          setPrincipalDisponible(true);
          setMostrarPrincipal(true);
          setResultados(conPrecios.slice(1));
          setDominiosAgregados(new Set());
        } else {
          const dominioConExtension = nombre.includes('.') ? nombre : `${nombre}.com`;
          setDominio(dominioConExtension);
          setPrincipalDisponible(false);
          setMostrarPrincipal(false);
          setResultados([]);
        }

      } else {
        const tieneExtension = nombre.includes('.') && EXTENSIONS.some(ext => nombre.endsWith(`.${ext}`));
        if (nombre.includes('.') && !tieneExtension) {
          setError('La extensión del dominio no es válida.');
          setBuscando(false);
          return;
        }

        const response = await fetch(`${import.meta.env.VITE_API_URL}/DominiosDisponible`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Chibcha-api-key": import.meta.env.VITE_API_KEY
          },
          body: JSON.stringify({
            domain: nombre.includes('.') ? nombre.split('.')[0] : nombre
          })
        });

        const data = await response.json();

        const dominioPrincipal = tieneExtension ? nombre : `${nombre}.com`;
        const estadoPrincipal = data.alternativas.find(d => d.domain === dominioPrincipal);
        const estaDisponible = estadoPrincipal && estadoPrincipal.registered === false;

        setPrincipalDisponible(estaDisponible);
        setMostrarPrincipal(!dominiosEnCarrito.has(dominioPrincipal));

        const disponibles = data.alternativas.filter((d) =>
          d.registered === false &&
          !dominiosEnCarrito.has(d.domain)
        );

        const conPrecios = disponibles.map((dom) => ({
          id: dom.domain,
          nombre: dom.domain,
          precio: precios[dom.domain.split('.').pop()] ?? 10000,
        }));

        const dominioConExtension = nombre.includes('.') ? nombre : `${nombre}.com`;
        setDominio(dominioConExtension);
        setResultados(conPrecios);
      }
    } catch (error) {
      console.error("Error al consultar dominios:", error);
      setError('Ocurrió un error al consultar los dominios.');
    } finally {
      setBuscando(false);
      setBuscado(true);
    }
  };

  const agregarAlCarrito = async (dom) => {
    if (!usuario || !usuario.identificacion || !usuario.idcuenta) {
      alert(" ❌ Debes iniciar sesión para agregar dominios al carrito.");
      return;
    }

    // Actualización optimista: agregamos al Set inmediatamente
    setDominiosAgregados(prev => {
      const next = new Set(prev);
      next.add(dom.id);
      return next;
    });

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/agregarDominio`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Chibcha-api-key': import.meta.env.VITE_API_KEY
        },
        body: JSON.stringify({
          iddominio: dom.id,
          nombrepagina: dom.nombre,
          preciodominio: dom.precio,
          ocupado: false,
          identificacion: usuario.identificacion 
        })
      });

      if (!response.ok) throw new Error("Error al agregar dominio");

      const response2 = await fetch(`${import.meta.env.VITE_API_URL}/dominios/agregar-a-carrito-existente`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Chibcha-api-key': import.meta.env.VITE_API_KEY
        },
        body: JSON.stringify({
          iddominio: dom.id,
          idcuenta: usuario.idcuenta,
        })
      });

      if (!response2.ok) throw new Error("Error al asociar dominio al carrito");
    } catch (err) {
      console.error(err);
      // Revertimos la actualización optimista si falla
      setDominiosAgregados(prev => {
        const next = new Set(prev);
        next.delete(dom.id);
        return next;
      });
      alert("❌ No se pudo agregar el dominio al carrito.");
    }
  };

  return (
    <main className={`dominios ${tipoBusqueda === 'ia' ? 'modo-ia' : ''}`}>
      {/* Filtro de búsqueda */}
      <div className="hero-toggle" role="group" aria-label="Seleccionar tipo de búsqueda de dominio">
        <button
          className={tipoBusqueda === 'normal' ? 'activo' : ''}
          onClick={() => setTipoBusqueda('normal')}
          type="button"
        >
          Dominio normal
        </button>
        <button
          onClick={() => setTipoBusqueda('ia')}
          title="IA"
          aria-label="IA"
          className={`boton-selector-ia-metaphora ${tipoBusqueda === 'ia' ? 'activo' : ''}`}
          type="button"
        >
          IA
        </button>
      </div>

      {/* Buscador */}
    <div className="buscador-contenedor">
      <div className="buscador">
        <label htmlFor="domain-search-input" className="sr-only">
          {tipoBusqueda === 'normal' ? "Buscar dominio específico" : "Buscar dominio mediante inteligencia artificial"}
        </label>
        <input
          type="text"
          id="domain-search-input"
          placeholder={tipoBusqueda === 'ia' ? "Describe tu idea de negocio" : "chibchaweb"}
          value={input}
          onChange={e => setInput(e.target.value)}
        />
        <button className="boton-buscador-metaphora" onClick={() => manejarBusqueda(null, tipoBusqueda)} title="Buscar Dominio" aria-label="Buscar Dominio">
          <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="30" height="30">
            <rect x="28" y="28" width="7" height="17" rx="3.5" transform="rotate(-45 32 37)" fill="#FFFFFF" />
            <path d="M 23 23 L 26 26" stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round"/>
            <circle cx="18" cy="18" r="12" fill="none" stroke="#FFFFFF" strokeWidth="3.5" />
            <circle cx="18" cy="18" r="9" fill="#FFFFFF" fillOpacity="0.3" />
            <path d="M 12 14 A 7 7 0 0 1 20 10" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" opacity="0.9" />
          </svg>
        </button>
      </div>
    </div>

      {buscando && <Loader mensaje="Consultando dominios disponibles" />}

      {error && <div className="alerta-error">{error}</div>}

      {buscado && !buscando && !error && (
        <>
          {mostrarPrincipal && (
            <div className="resultado">
              <div className="bloque resultado-dominio">
                <div className="info-dominio">
                  <strong>{dominio}</strong>
                  <div className="precio-dominio">
                    ${(
                      precios[dominio.split('.').pop()] ?? 10000
                    ).toLocaleString()} USD
                  </div>
                  <p>
                    {principalDisponible
                      ? 'Este dominio está disponible'
                      : 'Este dominio no está disponible'}
                  </p>
                </div>
                <button
                  className="boton-carrito-metaphora"
                  disabled={
                    !principalDisponible || dominiosAgregados.has(dominio)
                  }
                  onClick={() =>
                    agregarAlCarrito({
                      id: dominio,
                      nombre: dominio,
                      precio: precios[dominio.split('.').pop()] ?? 10000,
                    })
                  }
                  title={dominiosAgregados.has(dominio) ? "Agregado" : "Agregar al carrito"}
                  aria-label={dominiosAgregados.has(dominio) ? "Agregado" : "Agregar al carrito"}
                >
                  {dominiosAgregados.has(dominio) ? (
                    <><svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="9" cy="21" r="1" />
                      <circle cx="20" cy="21" r="1" />
                      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                      <polyline points="11 10 13 12 17 8" />
                    </svg> ✓</>
                  ) : (
                    <><svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="9" cy="21" r="1" />
                      <circle cx="20" cy="21" r="1" />
                      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                      <line x1="12" y1="9" x2="16" y2="9" />
                      <line x1="14" y1="7" x2="14" y2="11" />
                    </svg> +</>
                  )}
                </button>
              </div>

              <div className="bloque hosting">
                <strong>¿Ya cuenta con servicio de Hosting para su sitio web?</strong>
                <p>ChibchaWeb ofrece este servicio a precios justos</p>
                <button className="btn-agregar" onClick={() => window.location.href = "/planesHosting"}>
                  Adquirir Hosting
                </button>
              </div>
            </div>
          )}

          <h3>Alternativas</h3>
          <div className="alternativas">
            {resultados.length === 0 ? (
              <div className="sin-resultados">
                No encontramos dominios disponibles en este momento.<br />
                Prueba con otro nombre o modifica tu búsqueda.
              </div>
            ) : (
              resultados.map((r, i) => (
                <div key={i} className="alternativa">
                  <span>{r.nombre}</span>
                  <div className="precio-y-boton">
                    <span className="precio">${r.precio.toLocaleString()} USD</span>
                    <button
                      className="boton-carrito-metaphora"
                      onClick={() => agregarAlCarrito(r)}
                      disabled={dominiosAgregados.has(r.id)}
                      title={dominiosAgregados.has(r.id) ? "Agregado" : "Agregar al carrito"}
                      aria-label={dominiosAgregados.has(r.id) ? "Agregado" : "Agregar al carrito"}
                    >
                      {dominiosAgregados.has(r.id) ? (
                        <><svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="9" cy="21" r="1" />
                          <circle cx="20" cy="21" r="1" />
                          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                          <polyline points="11 10 13 12 17 8" />
                        </svg> ✓</>
                      ) : (
                        <><svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="9" cy="21" r="1" />
                          <circle cx="20" cy="21" r="1" />
                          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                          <line x1="12" y1="9" x2="16" y2="9" />
                          <line x1="14" y1="7" x2="14" y2="11" />
                        </svg> +</>
                      )}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </main>
  );

}

export default Dominios;
