import './Footer.css';
import '@fortawesome/fontawesome-free/css/all.min.css'; // Importar Font Awesome completo
import { NavLink } from 'react-router-dom';
import { useUser } from '../Context/UserContext';
import { useLanguage } from '../Context/LanguageContext';

function Footer() {
  const { usuario } = useUser();
  const { t } = useLanguage();

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
          <p>{t('puertaDigital')}</p>
          <div className="social-links">
            <a
              href="https://www.facebook.com/profile.php?id=61579028858597"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fab fa-facebook-f" aria-hidden="true"></i>
              <span className="sr-only">Facebook de ChibchaWeb (se abre en una nueva pestaña)</span>
            </a>
            <a
              href="https://www.instagram.com/chibchaweb/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fab fa-instagram" aria-hidden="true"></i>
              <span className="sr-only">Instagram de ChibchaWeb (se abre en una nueva pestaña)</span>
            </a>
            <a
              href="https://x.com/ChibchaWeb"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fab fa-x-twitter" aria-hidden="true"></i>
              <span className="sr-only">X (anteriormente Twitter) de ChibchaWeb (se abre en una nueva pestaña)</span>
            </a>
          </div>
        </div>

        {/* Navegación */}
        <nav aria-label={t('piePagina')}>
          <ul className="footer-links">
            <li>
              <NavLink to="/" className="nav-link">{t('inicio')}</NavLink>
            </li>
            <li>
              <NavLink to="/planesHosting" className="nav-link">{t('hosting')}</NavLink>
            </li>
            {usuario ? (
              <li>
                <NavLink to="/soporte" className="nav-link">{t('soporte')}</NavLink>
              </li>
            ) : (
              <li>
                <NavLink to="/login" className="nav-link">{t('iniciarSesion')}</NavLink>
              </li>
            )}
            <li>
              <NavLink to="/contacto" className="nav-link">{t('contacto')}</NavLink>
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
