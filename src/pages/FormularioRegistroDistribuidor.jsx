import React, { useState } from "react";
import "./FormularioRegistroDistribuidor.css";
import logo from "../Components/resources/logo.png";
import { useNavigate, Link } from "react-router-dom";

export default function FormularioRegistroDistribuidor() {
  const [form, setForm] = useState({
    razonSocial: "",
    nit: "",
    correo: "",
    telefono: "",
    direccion: "",
    contrasenaCuenta: "",
    contrasenaRepetida: "",
    idpais: "170",
  });

  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(false);
  const navigate = useNavigate();

  const manejarCambio = (e) => {
    const { name, value } = e.target;

    if (name === "telefono" && /[^\d]/.test(value)) return;
    if (name === "nit" && /[^0-9]/.test(value)) return;

    setForm({ ...form, [name]: value });
  };

  const validar = () => {
    if (form.contrasenaCuenta !== form.contrasenaRepetida) {
      return "Las contraseñas no coinciden.";
    }

    // Validar longitud del NIT
    if (!/^\d{9,10}$/.test(form.nit)) {
      return "El NIT debe tener entre 9 y 10 dígitos numéricos.";
    }

    const paisesValidos = ["76", "170", "218", "604", "862"];
    if (!paisesValidos.includes(form.idpais)) {
      return "País no soportado.";
    }

    return null;
  };

  const manejarSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");

    const error = validar();
    if (error) {
      setMensaje(error);
      return;
    }

    setCargando(true);

    const datos = {
      nombrecuenta: form.razonSocial,
      identificacion: form.nit,
      correo: form.correo,
      telefono: form.telefono || "0",
      direccion: form.direccion || "N/A",
      password: form.contrasenaCuenta,
      idtipocuenta: "2",
      idpais: form.idpais,
      idplan: "1",
    };

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/registrar2`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Chibcha-api-key": import.meta.env.VITE_API_KEY,
        },
        body: JSON.stringify(datos),
      });

      if (!res.ok) {
        const texto = await res.text();
        setMensaje(`Error: ${texto}`);
        return;
      }

      const respuesta = await res.json();
      const idcuenta = respuesta.idcuenta;

      localStorage.setItem("idCuenta", idcuenta);
      localStorage.setItem(
        "loginTemp",
        JSON.stringify({
          identificacion: form.nit,
          password: form.contrasenaCuenta,
        })
      );

      setMensaje("✅ Distribuidor registrado. Redirigiendo a verificación...");

      setForm({
        razonSocial: "",
        nit: "",
        correo: "",
        telefono: "",
        direccion: "",
        contrasenaCuenta: "",
        contrasenaRepetida: "",
        idpais: "170",
      });

      setTimeout(() => navigate("/verificar"), 1500);
    } catch (err) {
      console.error("Error de red:", err);
      setMensaje("Error de red al registrar distribuidor.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="registro-container">
      <div className="registro-imagen"></div>
      <div className="form-wrapper">
        <div className="registro-form">
          <img src={logo} alt="ChibchaWeb logo" className="registro-logo" />
          <h3 className="subtitulo">
            Accede a nuestros planes de distribución y beneficios exclusivos
          </h3>
          <h1 className="titulo">
            Regístrate como distribuidor y comienza a generar ingresos hoy mismo
          </h1>

          <form onSubmit={manejarSubmit} className="form-dos-columnas">
            {/* Columna izquierda */}
            <div className="columna-formulario">
              <fieldset className="fieldset-formulario">
                <legend className="separador-formulario">Datos de la empresa</legend>
                <label htmlFor="dist-razon-social" className="sr-only">Razón social</label>
                <input
                  type="text"
                  id="dist-razon-social"
                  placeholder="Razón social"
                  name="razonSocial"
                  required
                  value={form.razonSocial}
                  onChange={manejarCambio}
                  autoComplete="organization"
                />
                <label htmlFor="dist-nit" className="sr-only">NIT de la empresa</label>
                <input
                  type="text"
                  id="dist-nit"
                  placeholder="NIT de la empresa"
                  name="nit"
                  required
                  value={form.nit}
                  onChange={manejarCambio}
                  maxLength={10}
                  autoComplete="off"
                />
              </fieldset>

              <fieldset className="fieldset-formulario">
                <legend className="separador-formulario">Datos de contacto</legend>
                <label htmlFor="dist-correo" className="sr-only">Correo electrónico</label>
                <input
                  type="email"
                  id="dist-correo"
                  placeholder="Correo electrónico"
                  name="correo"
                  required
                  value={form.correo}
                  onChange={manejarCambio}
                  autoComplete="email"
                />
                <label htmlFor="dist-telefono" className="sr-only">Teléfono</label>
                <input
                  type="tel"
                  id="dist-telefono"
                  placeholder="Teléfono"
                  name="telefono"
                  value={form.telefono}
                  onChange={manejarCambio}
                  autoComplete="tel"
                />
                <label htmlFor="dist-direccion" className="sr-only">Dirección</label>
                <input
                  type="text"
                  id="dist-direccion"
                  placeholder="Dirección"
                  name="direccion"
                  value={form.direccion}
                  onChange={manejarCambio}
                  autoComplete="street-address"
                />
              </fieldset>
            </div>

            {/* Columna derecha */}
            <div className="columna-formulario">
              <fieldset className="fieldset-formulario">
                <legend className="separador-formulario">Credenciales</legend>
                <label htmlFor="dist-password" className="sr-only">Contraseña</label>
                <input
                  type="password"
                  id="dist-password"
                  placeholder="Contraseña"
                  name="contrasenaCuenta"
                  required
                  value={form.contrasenaCuenta}
                  onChange={manejarCambio}
                  autoComplete="new-password"
                />
                <label htmlFor="dist-repeat-password" className="sr-only">Repetir contraseña</label>
                <input
                  type="password"
                  id="dist-repeat-password"
                  placeholder="Repetir contraseña"
                  name="contrasenaRepetida"
                  required
                  value={form.contrasenaRepetida}
                  onChange={manejarCambio}
                  autoComplete="new-password"
                />
              </fieldset>

              <fieldset className="fieldset-formulario">
                <legend className="separador-formulario">País</legend>
                <label htmlFor="dist-pais" className="sr-only">País</label>
                <select id="dist-pais" name="idpais" value={form.idpais} onChange={manejarCambio} autoComplete="country">
                  <option value="76">Brasil</option>
                  <option value="170">Colombia</option>
                  <option value="218">Ecuador</option>
                  <option value="604">Perú</option>
                  <option value="862">Venezuela</option>
                </select>
              </fieldset>

              <button type="submit" disabled={cargando}>
                {cargando ? "Registrando..." : "Registrarse"}
              </button>
            </div>
          </form>

          {mensaje && <p className="mensaje-estado">{mensaje}</p>}

          <p className="login-link">
            ¿Ya tienes una cuenta? <Link to="/login">Inicia sesión</Link>
          </p>
        </div>
      </div>
      <div className="registro-imagen"></div>
    </div>
  );
}
