import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '../../context/SessionContext.jsx';
import Footer from '../../components/layout/Footer/Footer.jsx';
import './AccessPage.css';

/**
 * FLOWPASS - Tela de Acesso Centralizada (Stitch Screen 7adffc2a740642e4b3714816998bbef3)
 */
export default function AccessPage() {
  const navigate = useNavigate();
  const { session, saveSession } = useSession();

  const [teacherName, setTeacherName] = useState(session?.teacherName || '');
  const [room, setRoom] = useState(session?.room || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!teacherName.trim() || !room.trim()) return;

    setIsSubmitting(true);
    saveSession(teacherName.trim(), room.trim());

    setTimeout(() => {
      navigate('/dashboard');
    }, 450);
  };

  return (
    <div className="access-page-wrapper">
      <div className="access-ambient-glow-top"></div>
      <div className="access-ambient-glow-bottom"></div>

      <main className="access-main-content">
        <div className="access-container">
          <div className="access-header-text">
            <h1 className="access-title">
              Bem-vindo(a) ao <span className="access-title-accent">FLOWPASS</span>
            </h1>
            <p className="access-subtitle">
              Autenticação e Registro da Sala de Prova
            </p>
          </div>

          <div className="access-card">
            <div className="access-card-header">
              <h2 className="access-card-title">Dados da Operação de Prova</h2>
            </div>

            <form className="access-form" onSubmit={handleSubmit}>
              <div className="access-form-group">
                <label className="access-label" htmlFor="prof-name">
                  <span className="material-symbols-outlined access-label-icon">badge</span>
                  Nome Completo do(a) Professor(a)
                </label>
                <input
                  id="prof-name"
                  type="text"
                  className="access-input"
                  placeholder="Ex: Prof. Carlos Eduardo Silveira"
                  value={teacherName}
                  onChange={(e) => setTeacherName(e.target.value)}
                  required
                />
              </div>

              <div className="access-form-group">
                <label className="access-label" htmlFor="prof-room">
                  <span className="material-symbols-outlined access-label-icon">meeting_room</span>
                  Sala de Aplicação da Prova
                </label>
                <input
                  id="prof-room"
                  type="text"
                  className="access-input"
                  placeholder="Ex: Sala 204 - Bloco Alpha"
                  value={room}
                  onChange={(e) => setRoom(e.target.value)}
                  required
                />
              </div>

              <div className="access-sync-notice">
                <div className="access-sync-icon-box">
                  <span className="material-symbols-outlined access-sync-icon">sync</span>
                </div>
                <p className="access-sync-text">
                  Ao confirmar, todos os cartões de circulação e chamados de saída serão sincronizados automaticamente com o seu perfil e esta sala.
                </p>
              </div>

              <button
                type="submit"
                className="access-submit-btn"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="access-btn-spinner"></span>
                    <span>Sincronizando Matriz da Sala...</span>
                  </>
                ) : (
                  <>
                    <span>Entrar e Iniciar Painel de Prova</span>
                    <span className="material-symbols-outlined">arrow_forward</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
