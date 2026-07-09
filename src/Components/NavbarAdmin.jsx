import { useState, useEffect } from 'react';
import './NavbarAdmin.css';
import logo from './resources/logo.png';
import { NavLink } from 'react-router-dom';
import { useUser } from '../Context/UserContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBars,
  faAngleLeft,
  faMoneyBill,
  faUsers,
  faUserCheck,
  faUserTie,
  faGlobe,
  faCloud,
  faUser,
  faUserGroup,
  faMoon,
  faCircleHalfStroke,
  faHeadset,
  faChartLine,
} from '@fortawesome/free-solid-svg-icons';

export default function NavbarAdmin() {
  const [sidebarAbierta, setSidebarAbierta] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const { usuario } = useUser();

  const toggleSidebar = () => {
    setSidebarAbierta(!sidebarAbierta);
  };

  // Modo oscuro
  useEffect(() => {
    const savedMode = localStorage.getItem("darkMode") === "true";
    setDarkMode(savedMode);
    document.body.classList.toggle("dark-mode", savedMode);
  }, []);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem("darkMode", newMode);
    document.body.classList.toggle("dark-mode", newMode);
  };

  return (
    <>
      <nav className={`sidebar-admin ${sidebarAbierta ? '' : 'collapsed'}`} aria-label="Menú de administración">
        <div className="sidebar-content-admin">
          {/* Encabezado */}
          <div className="sidebar-header">
            <div className="logo-container">
              <img src={logo} alt="Logotipo de ChibchaWeb" className="logo-img-admin" />
              {sidebarAbierta && (
                <div className="brand-text-admin">
                  <strong>ChibchaWeb</strong>
                  <span className="subtitle-admin">Admin</span>
                </div>
              )}
            </div>

              <button 
                className="toggle-button" 
                onClick={toggleSidebar}
                aria-label={sidebarAbierta ? "Colapsar barra lateral" : "Expandir barra lateral"}
                aria-expanded={sidebarAbierta}
                type="button"
              >
                <FontAwesomeIcon icon={sidebarAbierta ? faAngleLeft : faBars} aria-hidden="true" />
              </button>
          </div>

          {/* Menú */}
          <ul className="sidebar-menu-admin">
            <li>
              <NavLink to="/extensiones" className="nav-link-admin" aria-label="Precios">
                <FontAwesomeIcon icon={faMoneyBill} aria-hidden="true" />
                {sidebarAbierta && <span>Precios</span>}
              </NavLink>
            </li>
            <li>
              <NavLink to="/ClientesAdmin" className="nav-link-admin" aria-label="Usuarios">
                <FontAwesomeIcon icon={faUsers} aria-hidden="true" />
                {sidebarAbierta && <span>Usuarios</span>}
              </NavLink>
            </li>
            <li>
              <NavLink to="/PostuladosAdmin" className="nav-link-admin" aria-label="Postulados">
                <FontAwesomeIcon icon={faUserCheck} aria-hidden="true" />
                {sidebarAbierta && <span>Postulados</span>}
              </NavLink>
            </li>
            <li>
              <NavLink to="/EmpleadosAdmin" className="nav-link-admin" aria-label="Empleados">
                <FontAwesomeIcon icon={faUserTie} aria-hidden="true" />
                {sidebarAbierta && <span>Empleados</span>}
              </NavLink>
            </li>
            <li>
              <NavLink to="/CoordinadoresAdmin" className="nav-link-admin" aria-label="Coordinadores">
                <FontAwesomeIcon icon={faUserGroup} aria-hidden="true" />
                {sidebarAbierta && <span>Coordinadores</span>}
              </NavLink>
            </li>
            <li>
              <NavLink to="/DistribuidoresAdmin" className="nav-link-admin" aria-label="Distribuidores">
                <FontAwesomeIcon icon={faGlobe} aria-hidden="true" />
                {sidebarAbierta && <span>Distribuidores</span>}
              </NavLink>
            </li>
            <li>
              <NavLink to="/paquetes" className="nav-link-admin" aria-label="Planes de Hosting">
                <FontAwesomeIcon icon={faCloud} aria-hidden="true" />
                {sidebarAbierta && <span>Hosting</span>}
              </NavLink>
            </li>
            <li>
              <NavLink to="/vista-soporte-admin" className="nav-link-admin" aria-label="Soporte técnico">
                <FontAwesomeIcon icon={faHeadset} aria-hidden="true" />
                {sidebarAbierta && <span>Soporte</span>}
              </NavLink>
            </li>
            <li>
              <NavLink to="/estadisticas" className="nav-link-admin" aria-label="Estadísticas de la plataforma">
                <FontAwesomeIcon icon={faChartLine} aria-hidden="true" />
                {sidebarAbierta && <span>Estadísticas</span>}
              </NavLink>
            </li>
            <li>
              <NavLink to="/perfil" className="nav-link-admin" aria-label="Mi Perfil">
                <FontAwesomeIcon icon={faUser} aria-hidden="true" />
                {sidebarAbierta && <span>Perfil</span>}
              </NavLink>
            </li>
            <li>
              <NavLink to="/comisiones" className="nav-link-admin" aria-label="Comisiones de distribuidores">
                <FontAwesomeIcon icon={faMoneyBill} aria-hidden="true" />
                {sidebarAbierta && <span>Comisiones</span>}
              </NavLink>
            </li>
          </ul>

          <div className="dark-mode-toggle-admin">
            <button 
              className="mode-toggle-button-admin" 
              onClick={toggleDarkMode}
              aria-label={darkMode ? "Activar modo claro" : "Activar modo oscuro"}
              type="button"
            >
              <FontAwesomeIcon icon={darkMode ? faCircleHalfStroke : faMoon} aria-hidden="true" />
              {sidebarAbierta && <span>{darkMode ? "" : ""}</span>}
            </button>
          </div>  
        </div>
      </nav>

      {sidebarAbierta && <div className="overlay" onClick={toggleSidebar} aria-hidden="true"></div>}
    </>
  );
}
