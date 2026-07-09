import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiLogOut, FiClipboard, FiUserCheck, FiUser } from "react-icons/fi";
import { useUser } from "../Context/UserContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoon, faCircleHalfStroke } from "@fortawesome/free-solid-svg-icons";
import "./NavbarCoordinador.css";

export default function NavbarCoordinador() {
  const { cerrarSesion } = useUser();
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedMode = localStorage.getItem("darkMode") === "true";
    setDarkMode(savedMode);

    if (savedMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, []);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem("darkMode", newMode);

    if (newMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  };

  const handleLogout = () => {
    cerrarSesion();
    navigate("/login");
  };

  return (
    <nav className={`navbar-coordinador ${darkMode ? "dark" : ""}`} aria-label="Navegación del coordinador">
      <div className="nav-logo">
        <Link to="/tickets" className="logo-text">ChibchaWeb</Link>
      </div>

      <ul className="nav-links">
        <li>
          <Link to="/tickets">
            <FiClipboard aria-hidden="true" /> Tickets
          </Link>
        </li>
        <li>
          <Link to="/asignar-tickets">
            <FiUserCheck aria-hidden="true" /> Asignar
          </Link>
        </li>
        <li>
          <Link to="/perfil">
            <FiUser aria-hidden="true" /> Perfil
          </Link>
        </li>
      </ul>

      <div className="nav-actions">
        <button className="mode-toggle-button" onClick={toggleDarkMode} aria-label={darkMode ? "Activar modo claro" : "Activar modo oscuro"} type="button">
          <FontAwesomeIcon icon={darkMode ? faCircleHalfStroke : faMoon} aria-hidden="true" />
        </button>

        <button className="logout-btn" onClick={handleLogout} type="button">
          <FiLogOut aria-hidden="true" /> Cerrar sesión
        </button>
      </div>
    </nav>
  );
}
