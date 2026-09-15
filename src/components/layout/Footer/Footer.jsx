import './Footer.css';

/**
 * Footer institucional do FLOWPASS (Colégio Adventista Asa Sul)
 */
export default function Footer() {
  return (
    <footer className="stitch-footer">
      <div className="dashboard-container stitch-footer-inner">
        <div className="stitch-footer-info">
          <span className="stitch-footer-tag">v1.0.4</span>
          <span>•</span>
          <span>FLOWPASS Gestão Escolar</span>
          <span>•</span>
          <strong>Colégio Adventista Asa Sul</strong>
        </div>

        <div className="stitch-footer-status">
          <span>Status Operacional: Nominal</span>
          <span className="stitch-status-dot" aria-label="Status Ativo"></span>
        </div>
      </div>
    </footer>
  );
}
