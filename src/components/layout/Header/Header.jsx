import { isFirebaseConfigured } from '../../../services/firebase';
import './Header.css';

/**
 * Header do FLOWPASS com indicador de conexão em tempo real
 * @param {Object} props
 * @param {function} props.onOpenNewPassModal - Callback para abrir o modal de novo pedido
 */
export default function Header({ onOpenNewPassModal }) {
  return (
    <header className="stitch-header">
      <div className="dashboard-container stitch-header-inner">
        <div className="stitch-header-brand">
          <div className="stitch-logo" aria-label="FLOWPASS">
            <span className="stitch-logo-text">
              FLOW<span className="stitch-logo-accent">PASS</span>
            </span>
          </div>

          <div
            className={`stitch-cloud-status ${
              isFirebaseConfigured ? 'status-connected' : 'status-demo'
            }`}
            title={
              isFirebaseConfigured
                ? 'Conectado ao Firebase Cloud Firestore em tempo real'
                : 'Modo demonstração local. Preencha o .env.local com suas chaves do Firebase para ativar a nuvem.'
            }
          >
            <span className="status-dot"></span>
            <span className="status-label">
              {isFirebaseConfigured ? 'Nuvem Realtime' : 'Modo Demo Local'}
            </span>
          </div>
        </div>

        <div className="stitch-header-actions">
          <button
            className="stitch-btn-new-pass"
            type="button"
            onClick={onOpenNewPassModal}
          >
            <span>Novo Pedido</span>
          </button>
        </div>
      </div>
    </header>
  );
}
