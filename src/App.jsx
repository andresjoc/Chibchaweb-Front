import { useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useUser } from './Context/UserContext';

// Componentes comunes
import Footer from "./Components/Footer";
import Navbar from "./Components/Navbar";

// Componentes para clientes
import Home from "./pages/Home";
import Dominios from "./pages/Dominios";
import Carrito from "./pages/Carrito";
import Login from "./pages/Login";
import FormularioC from "./pages/FormularioRegistroCliente";
import Cuenta from "./pages/Cuenta";
import Tarjeta from "./pages/Tarjeta";
import MetodosPago from "./pages/MetodosPago";
import PaqueteAdquirido from "./pages/PaqueteAdquirido";

// Componentes compartidos
import FormularioD from "./pages/FormularioRegistroDistribuidor";
import FormularioE from "./pages/FormularioRegistroEmpleado";
import Soporte from "./pages/Soporte";
import Comisiones from "./pages/Comisiones";
import VistaSoporteEmpleado from "./pages/VistaSoporteEmpleado";
import DominiosAdquiridos from "./pages/DominiosAdquiridos";
import ConfirmarCuenta from "./pages/ConfirmarCuenta";

// Componentes para administrador
import AdminNavbar from "./Components/NavbarAdmin";
import Extensiones from "./pages/Extensiones";
import FooterAdmin from "./Components/FooterAdmin";
import ClientesAdmin from "./pages/ClientesAdmin";
import ClienteDetalle from "./pages/ClienteDetalle";
import DistribuidoresAdmin from "./pages/DistribuidorAdmin";
import PlanesHosting from "./pages/PlanesHosting";
import PaquetesAdmin from "./pages/PaquetesAdmin";
import PostuladoDetalle from "./pages/PostuladoDetalle";
import PostuladosAdmin from "./pages/PostuladosAdmin";
import EmpleadosAdmin from "./pages/EmpleadosAdmin";
import EmpleadoDetalle from "./pages/EmpleadoDetalle";
import CoordinadoresAdmin from "./pages/CoordinadoresAdmin";
import VistaSoporteAdmin from "./pages/VistaSoporteAdmin";
import Contacto from "./pages/Contacto";
import Estadisticas from "./pages/Estadisticas";

// Componentes para coordinadores
import NavbarCoordinador from "./Components/NavbarCoordinador";
import FooterCoordinador from "./Components/FooterCoordinador";
import TicketsCoordinador from "./pages/TicketsCoordinador";
import AsignarTickets from "./pages/AsignarTickets";

// Página para POSTULADO
import CuentaPostulado from "./pages/CuentaPostulado";

// Ruta protegida
import RutaProtegida from "./Components/RutaProtegida";

import './styles.css';
import AccessibilityWidget from "./Components/AccessibilityWidget";

function App() {
  const { usuario, cargandoUsuario } = useUser();
  const location = useLocation();

  // Actualizar el título de la página dinámicamente según la ruta (WCAG 2.4.2)
  useEffect(() => {
    const titulos = {
      "/": "ChibchaWeb | Plataforma de Hosting y Dominios",
      "/login": "ChibchaWeb | Iniciar Sesión",
      "/registro": "ChibchaWeb | Registro de Cliente",
      "/registroDistribuidor": "ChibchaWeb | Registro de Distribuidor",
      "/registroEmpleado": "ChibchaWeb | Registro de Empleado",
      "/verificar": "ChibchaWeb | Verificar Cuenta",
      "/planesHosting": "ChibchaWeb | Planes de Hosting",
      "/paquetes": "ChibchaWeb | Administrar Paquetes",
      "/vista-soporte-empleado": "ChibchaWeb | Panel de Soporte - Empleado",
      "/vista-soporte-admin": "ChibchaWeb | Administrar Soporte",
      "/contacto": "ChibchaWeb | Contacto",
      "/perfil": "ChibchaWeb | Mi Perfil",
      "/carrito": "ChibchaWeb | Carrito de Compras",
      "/tarjeta": "ChibchaWeb | Administrar Tarjetas",
      "/metodos": "ChibchaWeb | Métodos de Pago",
      "/DominiosAdquiridos": "ChibchaWeb | Mis Dominios",
      "/soporte": "ChibchaWeb | Soporte Técnico",
      "/comisiones": "ChibchaWeb | Comisiones",
      "/extensiones": "ChibchaWeb | Administrar Extensiones",
      "/ClientesAdmin": "ChibchaWeb | Administrar Clientes",
      "/DistribuidoresAdmin": "ChibchaWeb | Administrar Distribuidores",
      "/PostuladosAdmin": "ChibchaWeb | Administrar Postulados",
      "/EmpleadosAdmin": "ChibchaWeb | Administrar Empleados",
      "/CoordinadoresAdmin": "ChibchaWeb | Administrar Coordinadores",
      "/estadisticas": "ChibchaWeb | Estadísticas",
      "/tickets": "ChibchaWeb | Tickets de Soporte - Coordinador",
      "/asignar-tickets": "ChibchaWeb | Asignar Tickets",
      "/dominios": "ChibchaWeb | Buscador de Dominios",
      "/paquete-adquirido": "ChibchaWeb | Paquete Adquirido",
    };

    let path = location.pathname;
    if (path.startsWith("/clientes/")) {
      document.title = "ChibchaWeb | Detalle de Cliente";
    } else if (path.startsWith("/postulado/")) {
      document.title = "ChibchaWeb | Detalle de Postulado";
    } else if (path.startsWith("/empleado/")) {
      document.title = "ChibchaWeb | Detalle de Empleado";
    } else if (path.startsWith("/dominios/")) {
      document.title = "ChibchaWeb | Detalle de Dominio";
    } else {
      document.title = titulos[path] || "ChibchaWeb | Plataforma de Hosting y Dominios";
    }
  }, [location]);

  const esAdmin = usuario?.tipocuenta === "ADMIN";
  const esCoordinador =
    ["COORDINADOR NIVEL 1", "COORDINADOR NIVEL 2", "COORDINADOR NIVEL 3"].includes(usuario?.tipocuenta);

  if (cargandoUsuario) {
    return <div className="pantalla-cargando">Cargando...</div>;
  }

  if (usuario?.tipocuenta === "POSTULADO") {
    return <CuentaPostulado />;
  }

  return (
    <div className={`app-layout ${esAdmin ? 'admin-layout' : ''}`}>
      <a href="#main-content" className="skip-link">
        Saltar al contenido principal
      </a>
      {/* Header que envuelve el Navbar dinámico (WCAG Landmark) */}
      <header>
        {usuario ? (
          esAdmin ? <AdminNavbar /> :
          esCoordinador ? <NavbarCoordinador /> :
          <Navbar />
        ) : <Navbar />}
      </header>

      <main id="main-content" className="main-content">
        <Routes>
          {/* Rutas públicas */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<FormularioC />} />
          <Route path="/registroDistribuidor" element={<FormularioD />} />
          <Route path="/registroEmpleado" element={<FormularioE />} />
          <Route path="/verificar" element={<ConfirmarCuenta />} />
          <Route path="/planesHosting" element={<PlanesHosting />} />
          <Route path="/paquetes" element={<PaquetesAdmin />} />
          <Route path="/vista-soporte-empleado" element={<VistaSoporteEmpleado />} />
          <Route path="/vista-soporte-admin" element={<VistaSoporteAdmin />} />
          <Route path="/contacto" element={<Contacto />} />

          {/* Rutas protegidas comunes */}
          <Route path="/perfil" element={<RutaProtegida><Cuenta /></RutaProtegida>} />
          <Route path="/carrito" element={<RutaProtegida requiereVerificacion={true}><Carrito /></RutaProtegida>} />
          <Route path="/tarjeta" element={<RutaProtegida><Tarjeta /></RutaProtegida>} />
          <Route path="/metodos" element={<RutaProtegida><MetodosPago /></RutaProtegida>} />
          <Route path="/DominiosAdquiridos" element={<RutaProtegida><DominiosAdquiridos /></RutaProtegida>} />
          <Route path="/soporte" element={<RutaProtegida><Soporte /></RutaProtegida>} />
          <Route path="/comisiones" element={<RutaProtegida><Comisiones /></RutaProtegida>} />

          {/* Rutas solo para administrador */}
          {esAdmin && <Route path="/extensiones" element={<Extensiones />} />}
          {esAdmin && <Route path="/ClientesAdmin" element={<ClientesAdmin />} />}
          {esAdmin && <Route path="/DistribuidoresAdmin" element={<DistribuidoresAdmin />} />}
          {esAdmin && <Route path="/clientes/:correo" element={<ClienteDetalle />} />}
          {esAdmin && <Route path="/PostuladosAdmin" element={<PostuladosAdmin />} />}
          {esAdmin && <Route path="/EmpleadosAdmin" element={<EmpleadosAdmin />} />}
          {esAdmin && <Route path="/CoordinadoresAdmin" element={<CoordinadoresAdmin />} />}
          {esAdmin && <Route path="/postulado/:correo" element={<PostuladoDetalle />} />}
          {esAdmin && <Route path="/empleado/:correo" element={<EmpleadoDetalle />} />}
          {esAdmin && <Route path="/estadisticas" element={<Estadisticas />} />}

          {/* Rutas para coordinadores */}
          {esCoordinador && <Route path="/tickets" element={<TicketsCoordinador />} />}
          {esCoordinador && <Route path="/asignar-tickets" element={<AsignarTickets />} />}

          {/* Rutas exclusivas para clientes */}
          {!esAdmin && !esCoordinador && <Route path="/dominios" element={<Dominios />} />}
          {!esAdmin && !esCoordinador && <Route path="/dominios/:nombre" element={<Dominios />} />}
          {!esAdmin && !esCoordinador && <Route path="/paquete-adquirido" element={<PaqueteAdquirido />} />}

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>

      {/* Footer dinámico */}
      {usuario ? (
        esAdmin ? <FooterAdmin /> :
        esCoordinador ? <FooterCoordinador /> :
        <Footer />
      ) : <Footer />}

      {/* Widget de accesibilidad global */}
      <AccessibilityWidget />
    </div>
  );
}

export default App;
