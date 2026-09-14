import { Link, NavLink } from 'react-router-dom';
import Button from '../../common/Button/Button.jsx';
import './Header.css';

export default function Header() {
  return (
    <header className="header">
      <div className="container header-container">
        <Link to="/" className="header-logo" aria-label="Flowpass Home">
          <span className="header-logo-icon">F</span>
          <span>Flowpass</span>
        </Link>

        <nav className="header-nav" aria-label="Navegação Principal">
          <ul className="header-nav-list">
            <li>
              <NavLink 
                to="/" 
                className={({ isActive }) => `header-nav-link ${isActive ? 'active' : ''}`}
              >
                Início
              </NavLink>
            </li>
            <li>
              <a href="#features" className="header-nav-link">Recursos</a>
            </li>
            <li>
              <a href="#about" className="header-nav-link">Sobre</a>
            </li>
          </ul>
        </nav>

        <div className="header-actions">
          <Button variant="secondary" size="small">
            Entrar
          </Button>
          <Button variant="primary" size="small">
            Começar Agora
          </Button>
        </div>
      </div>
    </header>
  );
}
