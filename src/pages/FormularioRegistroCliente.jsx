import React, { useState, useEffect } from "react";
import "./FormularioRegistroCliente.css";
import logo from "../Components/resources/logo.png";
import { useNavigate, Link } from "react-router-dom";

export default function FormularioRegistro() {
  const [form, setForm] = useState({
    nombreCuenta: "",
    identificacion: "",
    direccion: "",
    correo: "",
    telefono: "",
    contrasenaCuenta: "",
    repetirContrasena: "",
    idpais: "170",
    idplan: "1",
  });

  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(false);
  const navigate = useNavigate();

  // Vaciar campos al montar el componente
  useEffect(() => {
    setForm({
      nombreCuenta: "",
      identificacion: "",
      direccion: "",
      correo: "",
      telefono: "",
      contrasenaCuenta: "",
      repetirContrasena: "",
      idpais: "170",
      idplan: "1",
    });
  }, []);

  const manejarCambio = (e) => {
    const { name, value } = e.target;

    if ((name === "identificacion" || name === "telefono") && /[^\d]/.test(value)) {
      return;
    }

    setForm({ ...form, [name]: value });
  };

  const validar = () => {
    const paisesValidos = ["76", "170", "218", "604", "862"];
    if (!paisesValidos.includes(form.idpais)) {
      return "País no soportado";
    }

    if (form.contrasenaCuenta !== form.repetirContrasena) {
      return "Las contraseñas no coinciden.";
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
    identificacion: form.identificacion,
    nombrecuenta: form.nombreCuenta,
    correo: form.correo,
    telefono: form.telefono || "0",
    direccion: form.direccion,
    idtipocuenta: "1",
    idpais: form.idpais,
    idplan: form.idplan,
    password: form.contrasenaCuenta,
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

    if (res.ok) {
      const respuesta = await res.json();
      const idcuenta = respuesta.idcuenta;

      localStorage.setItem("idCuenta", idcuenta);
      localStorage.setItem(
        "loginTemp",
        JSON.stringify({
          identificacion: datos.identificacion,
          password: datos.password,
        })
      );

      setMensaje("✅ Cuenta registrada y carrito creado. Redirigiendo...");

      setForm({
        nombreCuenta: "",
        identificacion: "",
        direccion: "",
        correo: "",
        telefono: "",
        contrasenaCuenta: "",
        repetirContrasena: "",
        idpais: "170",
        idplan: "1",
      });

      setTimeout(() => {
        navigate("/verificar");
      }, 1500);
    } else {
      // 👇 Aquí el cambio importante
      setMensaje("❌ No se pudo completar el registro. Por favor, intenta más tarde.");
    }
  } catch (err) {
    console.error("Error de red:", err);
    setMensaje("❌ Error de red al registrar la cuenta.");
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
          <h3 className="subtitulo">Accede a nuestros planes de hosting</h3>
          <h1 className="titulo">Crea tu cuenta y empieza a construir tu presencia en la web</h1>

          <form onSubmit={manejarSubmit} className="form-dos-columnas">
            {/* Columna izquierda */}
            <div className="columna-formulario">
              <fieldset style={{ border: 'none', padding: 0, margin: '0 0 1.5rem 0' }}>
                <legend className="separador-formulario">Datos personales</legend>
                <label htmlFor="reg-nombre" className="sr-only">Nombre completo</label>
                <input type="text" id="reg-nombre" placeholder="Nombre completo" name="nombreCuenta" required value={form.nombreCuenta} onChange={manejarCambio} autoComplete="name" />
                
                <label htmlFor="reg-identificacion" className="sr-only">Identificación</label>
                <input type="text" id="reg-identificacion" placeholder="Identificación" name="identificacion" required value={form.identificacion} onChange={manejarCambio} maxLength={10} autoComplete="username" />
                
                <label htmlFor="reg-direccion" className="sr-only">Dirección (opcional)</label>
                <input type="text" id="reg-direccion" placeholder="Dirección (opcional)" name="direccion" value={form.direccion} onChange={manejarCambio} autoComplete="street-address" />
              </fieldset>

              <fieldset style={{ border: 'none', padding: 0, margin: '0 0 1.5rem 0' }}>
                <legend className="separador-formulario">Datos de contacto</legend>
                <label htmlFor="reg-correo" className="sr-only">Correo electrónico</label>
                <input type="email" id="reg-correo" placeholder="Correo electrónico" name="correo" required value={form.correo} onChange={manejarCambio} autoComplete="email" />
                
                <label htmlFor="reg-telefono" className="sr-only">Teléfono (opcional)</label>
                <input type="tel" id="reg-telefono" placeholder="Teléfono (opcional)" name="telefono" value={form.telefono} onChange={manejarCambio} maxLength={10} autoComplete="tel" />
              </fieldset>
            </div>

            {/* Columna derecha */}
            <div className="columna-formulario">
              <fieldset style={{ border: 'none', padding: 0, margin: '0 0 1.5rem 0' }}>
                <legend className="separador-formulario">Credenciales</legend>
                <label htmlFor="reg-password" className="sr-only">Contraseña</label>
                <input type="password" id="reg-password" placeholder="Contraseña" name="contrasenaCuenta" required value={form.contrasenaCuenta} onChange={manejarCambio} autoComplete="new-password" />
                
                <label htmlFor="reg-repeat-password" className="sr-only">Repetir contraseña</label>
                <input type="password" id="reg-repeat-password" placeholder="Repetir contraseña" name="repetirContrasena" required value={form.repetirContrasena} onChange={manejarCambio} autoComplete="new-password" />
              </fieldset>

              <fieldset style={{ border: 'none', padding: 0, margin: '0 0 1.5rem 0' }}>
                <legend className="separador-formulario">País</legend>
                <label htmlFor="reg-pais" className="sr-only">País</label>
                <select id="reg-pais" name="idpais" value={form.idpais} onChange={manejarCambio} autoComplete="country">
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
