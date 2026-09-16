import { useState } from 'react';
import Header from '../../components/layout/Header/Header.jsx';
import Footer from '../../components/layout/Footer/Footer.jsx';
import MetricTile from '../../components/dashboard/MetricTile/MetricTile.jsx';
import GradeFilter from '../../components/dashboard/GradeFilter/GradeFilter.jsx';
import PassCard from '../../components/dashboard/PassCard/PassCard.jsx';
import NewPassModal from '../../components/dashboard/NewPassModal/NewPassModal.jsx';
import useSchoolFlow from '../../hooks/useSchoolFlow.js';
import './DashboardPage.css';

export default function DashboardPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    activeStudents,
    rawActiveCount,
    queueStudents,
    rawQueueCount,
    selectedGrade,
    setSelectedGrade,
    metrics,
    canReleaseStudent,
    approveExit,
    rejectExit,
    confirmReturn,
    createPass,
    notifyInspector,
    inspectorAlert,
  } = useSchoolFlow();

  return (
    <div className="dashboard-page">
      {/* Header com Logo FLOWPASS e Botão + Novo Pedido */}
      <Header onOpenNewPassModal={() => setIsModalOpen(true)} />

      {/* Alerta de Notificação de Inspetor */}
      {inspectorAlert && (
        <div className="inspector-toast" role="alert">
          <span
            className="material-symbols-outlined"
            style={{ color: 'var(--color-error)' }}
          >
            notification_important
          </span>
          <span>{inspectorAlert}</span>
        </div>
      )}

      {/* Conteúdo Principal do Dashboard */}
      <main className="dashboard-main-content dashboard-container">
        {/* Subheader: Título do Painel */}
        <div className="dashboard-subheader">
          <h1 className="dashboard-page-title">
            Painel de Circulação em Tempo Real
          </h1>
        </div>

        {/* Régua de Métricas Rápidas (MetricTiles) */}
        <div className="dashboard-metrics-grid">
          <MetricTile
            label="Alunos Fora"
            value={String(metrics.totalActive).padStart(2, '0')}
            unit="alunos em circulação"
            icon="directions_walk"
            colorScheme="primary"
          />

          <MetricTile
            label="Tempo Médio Fora"
            value={metrics.formattedAvg}
            unit="min"
            icon="timer"
            colorScheme="secondary"
          />

          <MetricTile
            label="Fila Aguardando"
            value={String(metrics.totalQueue).padStart(2, '0')}
            unit="solicitações"
            icon="hourglass_top"
            colorScheme="tertiary"
          />

          <MetricTile
            label="Alertas de Tempo"
            value={String(metrics.overdueCount).padStart(2, '0')}
            unit="excedido (>15m)"
            icon="notification_important"
            colorScheme="error"
          />
        </div>

        {/* Filtro de Séries do Ensino Médio (Centralizado Acima das Colunas) */}
        <div className="dashboard-filter-section">
          <GradeFilter
            selectedGrade={selectedGrade}
            onSelectGrade={setSelectedGrade}
          />
        </div>

        {/* Layout Duas Colunas: Fila de Espera vs Alunos Ausentes */}
        <div className="dashboard-columns-grid">
          {/* Coluna 1: Fila de Espera */}
          <section className="dashboard-column" aria-labelledby="fila-title">
            <div className="dashboard-column-header">
              <div className="dashboard-column-title-group">
                <h2 id="fila-title" className="dashboard-column-title">
                  Fila de Espera
                </h2>
                <span className="dashboard-count-badge queue">
                  {String(queueStudents.length).padStart(2, '0')} alunos
                </span>
              </div>
            </div>
            <p className="dashboard-column-subtitle">
              Alunos aguardando permissão de saída autorizada em sala.
            </p>

            <div className="dashboard-cards-list">
              {queueStudents.length > 0 ? (
                queueStudents.map((student) => (
                  <PassCard
                    key={student.id}
                    mode="queue"
                    student={student}
                    onApprove={approveExit}
                    onReject={rejectExit}
                    canRelease={canReleaseStudent}
                  />
                ))
              ) : (
                <div className="dashboard-empty-card">
                  Nenhum estudante na fila de espera para {selectedGrade === 'all' ? 'o Ensino Médio' : selectedGrade}.
                </div>
              )}
            </div>
          </section>

          {/* Coluna 2: Alunos Ausentes (Em Circulação) */}
          <section className="dashboard-column" aria-labelledby="ausentes-title">
            <div className="dashboard-column-header">
              <div className="dashboard-column-title-group">
                <h2 id="ausentes-title" className="dashboard-column-title">
                  Alunos Ausentes
                </h2>
                <span className="dashboard-count-badge active">
                  {String(activeStudents.length).padStart(2, '0')} alunos
                </span>
              </div>
            </div>
            <p className="dashboard-column-subtitle">
              Monitoramento com cronômetro em tempo real fora de sala.
            </p>

            <div className="dashboard-cards-list">
              {activeStudents.length > 0 ? (
                activeStudents.map((student) => (
                  <PassCard
                    key={student.id}
                    mode="active"
                    student={student}
                    onConfirmReturn={confirmReturn}
                    onNotifyInspector={notifyInspector}
                  />
                ))
              ) : (
                <div className="dashboard-empty-card">
                  Nenhum estudante fora de sala para {selectedGrade === 'all' ? 'o Ensino Médio' : selectedGrade}.
                </div>
              )}
            </div>
          </section>
        </div>
      </main>

      {/* Modal de Emissão de Novo Pedido de Saída */}
      <NewPassModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreatePass={createPass}
        canRelease={canReleaseStudent}
      />

      {/* Footer Colégio Adventista Asa Sul */}
      <Footer />
    </div>
  );
}
