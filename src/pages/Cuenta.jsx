import { useUser } from "../Context/UserContext";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faUser, 
  faAddressCard, 
  faEnvelope, 
  faPhone, 
  faMapPin, 
  faGlobe, 
  faLock, 
  faPen, 
  faCheck, 
  faTimes 
} from "@fortawesome/free-solid-svg-icons";
import "./Cuenta.css";
import "./CuentaDistribuidor.css";
import { FiLogOut } from "react-icons/fi";

export default function Cuenta() {
  const { usuario, setUsuario } = useUser();
  const navigate = useNavigate();

  const [modoEdicion, setModoEdicion] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [formData, setFormData] = useState({});
  const [mostrarDialogo, setMostrarDialogo] = useState(false);
  const [contrasenaActual, setContrasenaActual] = useState("");
  const [contrasenaNueva, setContrasenaNueva] = useState("");
  const [cambiandoContrasena, setCambiandoContrasena] = useState(false);

  const [infoDistribuidor, setInfoDistribuidor] = useState(null);
  const [distLoading, setDistLoading] = useState(false);
  const [distError, setDistError] = useState("");

  const paises = {
    76: "BRASIL",
    170: "COLOMBIA",
    218: "ECUADOR",
    604: "PERÚ",
    862: "VENEZUELA",
  };

  const obtenerCodigoDePais = (nombre) => {
    const mapa = {
      BRASIL: 76,
      COLOMBIA: 170,
      ECUADOR: 218,
      PERÚ: 604,
      VENEZUELA: 862,
    };
    return typeof nombre === "number" ? nombre : mapa[nombre?.toUpperCase()] ?? 170;
  };

  useEffect(() => {
    const datosIniciales = {
      IDCUENTA: usuario.idcuenta,
      IDTIPOCUENTA: typeof usuario.tipocuenta === "number" ? usuario.tipocuenta : 1,
      IDPLAN:
        typeof usuario.plan === "number"
          ? usuario.plan
          : usuario.plan === "Sin plan"
          ? 0
          : 1,
      NOMBRECUENTA: usuario.nombrecuenta,
      CORREO: usuario.correo,
      TELEFONO: usuario.telefono || "",
      FECHAREGISTRO: usuario.fecharegistro,
      DIRECCION: usuario.direccion || "",
      IDPAIS: obtenerCodigoDePais(usuario.pais),
    };
    setFormData(datosIniciales);

    if (usuario.tipocuenta?.toUpperCase() === "DISTRIBUIDOR") {
      const loadDistribuidor = async () => {
        try {
          setDistLoading(true);
          setDistError("");
          const res = await fetch(
            `${import.meta.env.VITE_API_URL}/ahorro-distribuidor?idcuenta=${usuario.idcuenta}`,
            {
              headers: {
                "Chibcha-api-key": import.meta.env.VITE_API_KEY,
              },
            }
          );
          if (!res.ok) throw new Error("No se pudo obtener la información.");
          const data = await res.json();
          setInfoDistribuidor(data);
        } catch (e) {
          setDistError(e.message || "Error desconocido");
        } finally {
          setDistLoading(false);
        }
      };
      loadDistribuidor();
    } else {
      setInfoDistribuidor(null);
      setDistError("");
      setDistLoading(false);
    }
  }, [usuario]);

  const cerrarSesion = () => {
    setUsuario(null);
    localStorage.removeItem("usuario");
    navigate("/login");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "IDPAIS" || name === "IDPLAN" || name === "TELEFONO" ? parseInt(value) : value,
    }));
  };

// (todo el código anterior permanece igual)

const guardarCambios = async () => {
  if (!formData.NOMBRECUENTA.trim()) {
    alert("El nombre no puede estar vacío.");
    return;
  }

  if (!/\S+@\S+\.\S+/.test(formData.CORREO)) {
    alert("El correo electrónico no es válido.");
    return;
  }

  setGuardando(true);
  try {
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/admin/modificar_cuenta/${formData.IDCUENTA}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Chibcha-api-key": import.meta.env.VITE_API_KEY,
        },
        body: JSON.stringify(formData),
      }
    );

    if (!res.ok) throw new Error("No se pudo guardar.");

    alert("Perfil actualizado con éxito. Por seguridad, inicia sesión nuevamente.");
    setUsuario(null);
    localStorage.removeItem("usuario");
    navigate("/login");
  } catch (error) {
    console.error("❌ Error al guardar:", error);
    alert("Hubo un error al actualizar el perfil.");
  } finally {
    setGuardando(false);
  }
};


  const cambiarContrasena = async () => {
    if (!contrasenaActual || !contrasenaNueva) {
      alert("Por favor llena ambos campos.");
      return;
    }

    setCambiandoContrasena(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/cambiar-contrasena`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Chibcha-api-key": import.meta.env.VITE_API_KEY,
        },
        body: JSON.stringify({
          idcuenta: usuario.idcuenta,
          contrasena_actual: contrasenaActual,
          contrasena_nueva: contrasenaNueva,
        }),
      });

      if (!res.ok) throw new Error("No se pudo actualizar la contraseña.");

      alert("Contraseña actualizada correctamente.");
      setMostrarDialogo(false);
      setContrasenaActual("");
      setContrasenaNueva("");
    } catch (error) {
      console.error("❌ Error al cambiar contraseña:", error);
      alert("Error al actualizar la contraseña.");
    } finally {
      setCambiandoContrasena(false);
    }
  };

  const tiposRestringidos = [
    "COORDINADOR NIVEL 1",
    "COORDINADOR NIVEL 2",
    "COORDINADOR NIVEL 3",
    "TECNICO NIVEL 1",
    "TECNICO NIVEL 2",
    "TECNICO NIVEL 3",
    "ADMIN",
  ];

  const puedeVerMetodosPago = !tiposRestringidos.includes(usuario.tipocuenta?.toUpperCase?.());

  return (
    <div className="cuenta-container">
      {/* Sección de avatar y tipo de cuenta */}
      <div className="perfil-avatar-seccion">
        <div className="avatar-circulo" aria-hidden="true">
          {usuario.nombrecuenta?.charAt(0).toUpperCase()}
        </div>
        <div className="avatar-meta">
          <h2>{usuario.nombrecuenta}</h2>
          <span className="badge-tipo-cuenta">{usuario.tipocuenta}</span>
        </div>
      </div>

      <div className="linea-separadora" />

      <div className="cuenta-info">
        {modoEdicion ? (
          <>
            <div className="cuenta-dato-edicion">
              <label htmlFor="perfil-nombre">
                <FontAwesomeIcon icon={faUser} className="icono-dato" aria-hidden="true" />
                <strong>Nombre:</strong>
              </label>
              <input id="perfil-nombre" name="NOMBRECUENTA" value={formData.NOMBRECUENTA} onChange={handleInputChange} autoComplete="name" />
            </div>
            <div className="cuenta-dato-edicion">
              <label htmlFor="perfil-correo">
                <FontAwesomeIcon icon={faEnvelope} className="icono-dato" aria-hidden="true" />
                <strong>Correo:</strong>
              </label>
              <input id="perfil-correo" name="CORREO" value={formData.CORREO} onChange={handleInputChange} autoComplete="email" />
            </div>
            <div className="cuenta-dato-edicion">
              <label htmlFor="perfil-telefono">
                <FontAwesomeIcon icon={faPhone} className="icono-dato" aria-hidden="true" />
                <strong>Teléfono:</strong>
              </label>
              <input id="perfil-telefono" name="TELEFONO" value={formData.TELEFONO} onChange={handleInputChange} autoComplete="tel" />
            </div>
            <div className="cuenta-dato-edicion">
              <label htmlFor="perfil-direccion">
                <FontAwesomeIcon icon={faMapPin} className="icono-dato" aria-hidden="true" />
                <strong>Dirección:</strong>
              </label>
              <input id="perfil-direccion" name="DIRECCION" value={formData.DIRECCION} onChange={handleInputChange} autoComplete="street-address" />
            </div>
            <div className="cuenta-dato-edicion">
              <label htmlFor="perfil-pais">
                <FontAwesomeIcon icon={faGlobe} className="icono-dato" aria-hidden="true" />
                <strong>País:</strong>
              </label>
              <select id="perfil-pais" name="IDPAIS" value={formData.IDPAIS} onChange={handleInputChange} autoComplete="country">
                {Object.entries(paises).map(([codigo, nombre]) => (
                  <option key={codigo} value={codigo}>{nombre}</option>
                ))}
              </select>
            </div>
          </>
        ) : (
          <div className="perfil-detalles-grid">
            <div className="detalle-tarjeta">
              <FontAwesomeIcon icon={faUser} className="icono-detalle" aria-hidden="true" />
              <div className="detalle-texto">
                <span className="label">Nombre completo</span>
                <span className="valor">{usuario.nombrecuenta}</span>
              </div>
            </div>
            <div className="detalle-tarjeta">
              <FontAwesomeIcon icon={faAddressCard} className="icono-detalle" aria-hidden="true" />
              <div className="detalle-texto">
                <span className="label">Cédula / Identificación</span>
                <span className="valor">{usuario.identificacion}</span>
              </div>
            </div>
            <div className="detalle-tarjeta">
              <FontAwesomeIcon icon={faEnvelope} className="icono-detalle" aria-hidden="true" />
              <div className="detalle-texto">
                <span className="label">Correo electrónico</span>
                <span className="valor">{usuario.correo}</span>
              </div>
            </div>
            <div className="detalle-tarjeta">
              <FontAwesomeIcon icon={faPhone} className="icono-detalle" aria-hidden="true" />
              <div className="detalle-texto">
                <span className="label">Teléfono celular</span>
                <span className="valor">{usuario.telefono || "No registrado"}</span>
              </div>
            </div>
            <div className="detalle-tarjeta">
              <FontAwesomeIcon icon={faMapPin} className="icono-detalle" aria-hidden="true" />
              <div className="detalle-texto">
                <span className="label">Dirección física</span>
                <span className="valor">{usuario.direccion || "No registrada"}</span>
              </div>
            </div>
            <div className="detalle-tarjeta">
              <FontAwesomeIcon icon={faGlobe} className="icono-detalle" aria-hidden="true" />
              <div className="detalle-texto">
                <span className="label">País de residencia</span>
                <span className="valor">{paises[usuario.pais] || usuario.pais}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ===================== DISTRIBUIDOR ===================== */}
      {usuario.tipocuenta?.toUpperCase() === "DISTRIBUIDOR" && (
        <section className="distribuidor-card">
          <div className="distribuidor-header">
            <h3>Descuentos aplicados</h3>
            {infoDistribuidor?.distribuidor?.plan && (
              <span className="badge">{infoDistribuidor.distribuidor.plan}</span>
            )}
          </div>

          {distLoading && <div className="distribuidor-loading">Cargando información…</div>}
          {distError && <div className="distribuidor-error">No se pudo cargar la información: {distError}</div>}

          {!distLoading && !distError && infoDistribuidor && (
            <>
              <div className="distribuidor-grid">
                <div className="grid-item"><span className="label">Comisión</span><span className="value">{infoDistribuidor.distribuidor.comision}%</span></div>
                <div className="grid-item"><span className="label">Nombre</span><span className="value">{infoDistribuidor.distribuidor.nombre}</span></div>
              </div>

              <div className="distribuidor-stats">
                <div className="stat"><div className="stat-title">Total dominios</div><div className="stat-value">{infoDistribuidor.total_dominios_comprados}</div></div>
                <div className="stat"><div className="stat-title">Total ahorrado</div><div className="stat-value currency">${Number(infoDistribuidor.total_ahorrado || 0).toLocaleString()}</div></div>
              </div>

              <div className="distribuidor-table-wrapper">
                <table className="distribuidor-table">
                  <caption className="sr-only">Historial de dominios comprados y comisiones aplicadas</caption>
                  <thead>
                    <tr>
                      <th scope="col">Dominio</th>
                      <th scope="col">Precio original</th>
                      <th scope="col">Ahorro por comisión</th>
                    </tr>
                  </thead>
                  <tbody>
                    {infoDistribuidor.dominios?.length > 0 ? (
                      infoDistribuidor.dominios.map((d, idx) => (
                        <tr key={idx}>
                          <td>{d.nombre_dominio}</td>
                          <td>${Number(d.precio_original).toLocaleString()}</td>
                          <td className="positivo">${Number(d.ahorro_por_comision).toLocaleString()}</td>
                        </tr>
                      ))
                    ) : (
                      <tr><td colSpan="3" className="empty">Aún no hay dominios registrados.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </section>
      )}
      {/* ======================================================== */}

      <div className="botones-accion">
        {modoEdicion ? (
          <>
            <button className="btn-metodo-pago" onClick={guardarCambios} disabled={guardando}>{guardando ? "Guardando..." : "Guardar cambios"}</button>
            <button className="btn-cerrar-sesion" onClick={() => setModoEdicion(false)}>Cancelar</button>
          </>
        ) : (
          <>
            <button className="btn-metodo-pago" onClick={() => setModoEdicion(true)}>Editar perfil</button>
            <button className="btn-metodo-pago" onClick={() => setMostrarDialogo(true)}>Actualizar contraseña</button>

            {puedeVerMetodosPago && (
              <>
                <button className="btn-metodo-pago" onClick={() => navigate("/Tarjeta")}>Agregar método de pago</button>
                <button className="btn-metodo-pago" onClick={() => navigate("/metodos")}>Mis métodos</button>
              </>
            )}

            <button className="btn-cerrar-sesion" onClick={cerrarSesion}>
              <FiLogOut style={{ marginRight: "8px" }} />
              Cerrar sesión
            </button>
          </>
        )}
      </div>

      {mostrarDialogo && (
        <div className="chibcha-modal-overlay">
          <div className="chibcha-modal">
            <h3>Actualizar contraseña</h3>
            <label htmlFor="modal-contrasena-actual" className="sr-only">Contraseña actual</label>
            <input id="modal-contrasena-actual" type="password" placeholder="Contraseña actual" value={contrasenaActual} onChange={(e) => setContrasenaActual(e.target.value)} autoComplete="current-password" />
            
            <label htmlFor="modal-contrasena-nueva" className="sr-only">Nueva contraseña</label>
            <input id="modal-contrasena-nueva" type="password" placeholder="Nueva contraseña" value={contrasenaNueva} onChange={(e) => setContrasenaNueva(e.target.value)} autoComplete="new-password" />
            <div className="modal-buttons">
              <button onClick={cambiarContrasena} disabled={cambiandoContrasena}>{cambiandoContrasena ? "Actualizando..." : "Actualizar"}</button>
              <button onClick={() => setMostrarDialogo(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
