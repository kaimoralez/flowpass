import './Header.css';

/**
 * Header simplificado do FLOWPASS (Stitch Design System)
 * @param {Object} props
 * @param {function} props.onOpenNewPassModal - Callback para abrir o modal de novo pedido
 */
export default function Header({ onOpenNewPassModal }) {
  return (
    <header className="stitch-header">
      <div className="dashboard-container stitch-header-inner">
        <div className="stitch-logo" aria-label="FLOWPASS">
          <span className="stitch-logo-text">
            FLOW<span className="stitch-logo-accent">PASS</span>
          </span>
        </div>

        <div className="stitch-header-actions">
          <button
            className="stitch-btn-new-pass"
            type="button"
            onClick={onOpenNewPassModal}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
              add
            </span>
            <span>+ Novo Pedido</span>
          </button>

          <div className="stitch-user-avatar" title="Operador Logado">
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
              person
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
