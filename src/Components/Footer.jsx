import './Footer.css';
import '@fortawesome/fontawesome-free/css/all.min.css'; // Importar Font Awesome completo
import { NavLink } from 'react-router-dom';
import { useUser } from '../Context/UserContext';

function Footer() {
  const { usuario } = useUser();

  return (
    <footer className="footer">
      <div
        className="footer-content"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        {/* Marca y redes */}
        <div className="footer-brand">
          <h3>ChibchaWeb</h3>
          <p>Tu puerta al mundo digital</p>
          <div className="social-links">
            <a
              href="https://www.facebook.com/profile.php?id=61579028858597"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook de ChibchaWeb (se abre en una nueva pestaña)"
            >
              <i className="fab fa-facebook-f" aria-hidden="true"></i>
            </a>
            <a
              href="https://www.instagram.com/chibchaweb/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram de ChibchaWeb (se abre en una nueva pestaña)"
            >
              <i className="fab fa-instagram" aria-hidden="true"></i>
            </a>
            <a
              href="https://x.com/ChibchaWeb"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="X (anteriormente Twitter) de ChibchaWeb (se abre en una nueva pestaña)"
            >
              <i className="fab fa-x-twitter" aria-hidden="true"></i>
            </a>
          </div>
        </div>

        {/* Navegación */}
        <nav aria-label="Navegación del pie de página">
          <ul className="footer-links">
            <li>
              <NavLink to="/" className="nav-link">Inicio</NavLink>
            </li>
            <li>
              <NavLink to="/planesHosting" className="nav-link">Hosting</NavLink>
            </li>
            {usuario ? (
              <li>
                <NavLink to="/soporte" className="nav-link">Soporte</NavLink>
              </li>
            ) : (
              <li>
                <NavLink to="/login" className="nav-link">Iniciar sesión</NavLink>
              </li>
            )}
            <li>
              <NavLink to="/contacto" className="nav-link">Contacto</NavLink>
            </li>
          </ul>
        </nav>
      </div>

      {/* Copyright */}
      <p className="footer-copy">
        &copy; {new Date().getFullYear()} ChibchaWeb. Todos los derechos reservados.
      </p>
    </footer>
  );
}

export default Footer;
