import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link to="/" className="footer-logo">
              <span className="footer-logo-icon">F</span>
              <span>Flowpass</span>
            </Link>
            <p className="footer-description">
              Plataforma moderna de gestão de acessos e fluxos automatizados com alta performance e simplicidade.
            </p>
          </div>

          <div>
            <h4 className="footer-column-title">Produto</h4>
            <ul className="footer-links">
              <li><a href="#features" className="footer-link">Recursos</a></li>
              <li><a href="#solutions" className="footer-link">Soluções</a></li>
              <li><a href="#pricing" className="footer-link">Preços</a></li>
            </ul>
          </div>

          <div>
            <h4 className="footer-column-title">Empresa</h4>
            <ul className="footer-links">
              <li><a href="#about" className="footer-link">Sobre nós</a></li>
              <li><a href="#blog" className="footer-link">Blog</a></li>
              <li><a href="#careers" className="footer-link">Carreiras</a></li>
            </ul>
          </div>

          <div>
            <h4 className="footer-column-title">Suporte</h4>
            <ul className="footer-links">
              <li><a href="#help" className="footer-link">Central de Ajuda</a></li>
              <li><a href="#docs" className="footer-link">Documentação</a></li>
              <li><a href="#status" className="footer-link">Status do Sistema</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {currentYear} Flowpass. Todos os direitos reservados.</p>
          <p>Construído com ReactJS e Vanilla CSS</p>
        </div>
      </div>
    </footer>
  );
}
