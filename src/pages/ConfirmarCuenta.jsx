import React, { useEffect, useState, useRef } from "react";
import "./ConfirmarCuenta.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faExclamationTriangle,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useUser } from "../Context/UserContext"; // ✅ Importar el contexto

export default function ConfirmarCuenta() {
  const [codigo, setCodigo] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [estado, setEstado] = useState(null); // "success" | "error" | "warning"
  const [cargando, setCargando] = useState(false);

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const yaConfirmado = useRef(false); // 🛑 para evitar verificación múltiple
  const { setUsuario } = useUser(); // ✅ Obtener setUsuario para inicio de sesión automático

  useEffect(() => {
    const tokenURL = searchParams.get("token");
    const idcuentaURL = searchParams.get("idcuenta");

    if (tokenURL && idcuentaURL && !yaConfirmado.current) {
      yaConfirmado.current = true;
      confirmarCuenta(tokenURL, idcuentaURL);
    }
  }, [searchParams]);

const confirmarCuenta = async (token, idcuenta) => {
  setCargando(true);
  setMensaje("");
  setEstado(null);

  try {
    const url = `${import.meta.env.VITE_API_URL}/confirmar-registro?token=${token}&idcuenta=${idcuenta}`;
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Chibcha-api-key": import.meta.env.VITE_API_KEY,
      },
    });

    if (res.ok) {
      const data = await res.json();
      // Guardar el usuario en el contexto y localStorage con verificado = true
      const usuarioFinal = { ...data, verificado: true };
      setUsuario(usuarioFinal);
      
      setMensaje("✅ Cuenta confirmada exitosamente. Iniciando sesión...");
      setEstado("success");
      setTimeout(() => navigate("/perfil"), 2000);
    } else {
      const data = await res.text();
      setMensaje(`❌ Error: ${data}`);
      setEstado("error");
    }
  } catch (err) {
    console.error(err);
    setMensaje("❌ Error al conectar con el servidor.");
    setEstado("error");
  } finally {
    setCargando(false);
  }
};


  const manejarSubmit = async (e) => {
    e.preventDefault();
    const idcuenta = localStorage.getItem("idCuenta")?.trim();

    if (!idcuenta || idcuenta.includes("{")) {
      setMensaje("⚠️ ID de cuenta inválido. Intenta registrarte de nuevo.");
      setEstado("warning");
      return;
    }

    confirmarCuenta(codigo, idcuenta);
  };

  const renderIcon = () => {
    if (estado === "success") return <FontAwesomeIcon icon={faCheckCircle} color="#28a745" />;
    if (estado === "error") return <FontAwesomeIcon icon={faExclamationTriangle} color="#dc3545" />;
    if (estado === "warning") return <FontAwesomeIcon icon={faExclamationTriangle} color="#ffc107" />;
    return null;
  };

  return (
    <div className="verificacion-wrapper">
      <div className="verificacion-card">
        <h2>Verificar tu cuenta</h2>
        <p>Ingresa el código que recibiste por correo para activar tu cuenta:</p>

        <form onSubmit={manejarSubmit}>
          <input
            type="text"
            placeholder="Código de verificación"
            value={codigo}
            onChange={(e) => setCodigo(e.target.value)}
            required
          />
          <button type="submit" disabled={cargando}>
            {cargando ? (
              <>
                <FontAwesomeIcon icon={faSpinner} spin /> Verificando...
              </>
            ) : (
              <>
                <FontAwesomeIcon icon={faCheckCircle} style={{ marginRight: "8px" }} />
                Confirmar
              </>
            )}
          </button>
        </form>

        {mensaje && (
          <p className={`mensaje-estado ${estado}`}>
            {renderIcon()} <span>{mensaje}</span>
          </p>
        )}

        <div className="volver-login">
          <p className="texto-pregunta">¿Ya estás registrado?</p>
          <button className="boton-login" onClick={() => navigate("/login")}>
            Volver al inicio de sesión
          </button>
        </div>
      </div>
    </div>
  );
}
