import { useState } from 'react';
import { useSession } from '../../../context/SessionContext.jsx';
import './PassCard.css';

/**
 * Formata segundos no formato MM:SS
 */
function formatSeconds(totalSeconds) {
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

/**
 * Componente de Card de Passe Escolar (Fila e Circulação Ativa)
 */
export default function PassCard({
  mode = 'queue', // 'queue' | 'active'
  student,
  onApprove,
  onReject,
  onConfirmReturn,
  canRelease,
}) {
  const { session } = useSession();
  const [isProcessing, setIsProcessing] = useState(false);

  const isMale = student.gender === 'M';
  const genderTitle = isMale ? 'Aluno' : 'Aluna';

  // Verificação do autor do pedido (Apenas quem criou pode negar saída)
  const loggedTeacher = session?.teacherName?.trim().toLowerCase();
  const passTeacher = student?.teacher?.trim().toLowerCase();
  const isPassAuthor = !loggedTeacher || !passTeacher || loggedTeacher === passTeacher;

  // Lógica de tempo e tolerância (15 min = 900s)
  const isOverdue = mode === 'active' && student.elapsedSeconds >= 900;
  const isNearLimit =
    mode === 'active' &&
    student.elapsedSeconds >= 600 &&
    student.elapsedSeconds < 900;

  // Verificação de regra de liberação para a fila
  const releaseCheck =
    mode === 'queue' && canRelease ? canRelease(student) : { allowed: true };

  const stripeClass = isOverdue
    ? 'overdue'
    : isNearLimit
    ? 'warning'
    : mode === 'active'
    ? 'normal'
    : '';

  const timerPillClass = isOverdue
    ? 'overdue'
    : isNearLimit
    ? 'warning'
    : mode === 'active'
    ? 'normal'
    : 'queue';

  const handleApproveClick = () => {
    if (!releaseCheck.allowed) return;
    setIsProcessing(true);
    setTimeout(() => {
      onApprove(student.id);
      setIsProcessing(false);
    }, 400);
  };

  const handleReturnClick = () => {
    setIsProcessing(true);
    setTimeout(() => {
      onConfirmReturn(student.id);
      setIsProcessing(false);
    }, 400);
  };

  return (
    <article className="pass-card">
      <div className={`pass-card-stripe ${stripeClass}`}></div>

      <div className="pass-card-header">
        <div className="pass-card-identity">
          <div className={`pass-card-avatar ${isMale ? 'aluno' : 'aluna'}`}>
            <span className="material-symbols-outlined" style={{ fontSize: '28px' }}>
              {isMale ? 'face' : 'face_3'}
            </span>
          </div>

          <div className="pass-card-info">
            <div className="pass-card-name-row">
              <span className="pass-card-name">{genderTitle}</span>
              <span className="pass-card-gender-badge">{genderTitle}</span>
              {student.isPriority && (
                <span className="pass-card-priority-badge">Prioridade</span>
              )}
              {isOverdue && (
                <span className="pass-card-priority-badge">Tempo Excedido</span>
              )}
            </div>

            <div className="pass-card-meta">
              <span>{student.classGroup}</span>
              <span>•</span>
              <span className="pass-card-room-code">{student.room}</span>
              <span>•</span>
              <span className="pass-card-teacher">
                <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>
                  person
                </span>
                {student.teacher}
              </span>
            </div>

            {mode === 'queue' && !releaseCheck.allowed && (
              <div className="pass-rule-warning-note">
                <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>
                  lock
                </span>
                <span>{releaseCheck.reason}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Barra de Tempo e Ações Operacionais */}
      <div className="pass-card-timeline-bar">
        <div className="pass-card-timer-block">
          {mode === 'queue' ? (
            <>
              <div className={`pass-timer-pill ${timerPillClass}`}>
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: '15px' }}
                >
                  schedule
                </span>
                <span>{formatSeconds(student.waitSeconds)} min de espera</span>
              </div>
              <span className="pass-card-time-label">
                Solicitado: {student.requestTime}
              </span>
            </>
          ) : (
            <>
              <div className={`pass-timer-pill ${timerPillClass}`}>
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: '15px' }}
                >
                  {isOverdue ? 'warning' : 'timer'}
                </span>
                <span>
                  {formatSeconds(student.elapsedSeconds)} min
                  {isOverdue && ' (+15m)'}
                </span>
              </div>
              <span className="pass-card-time-label">
                Saída: {student.exitTime}
              </span>
            </>
          )}
        </div>

        <div className="pass-card-actions">
          {mode === 'queue' ? (
            <>
              <button
                type="button"
                className={`pass-btn-primary ${!releaseCheck.allowed ? 'blocked' : ''}`}
                disabled={!releaseCheck.allowed || isProcessing}
                onClick={handleApproveClick}
                title={
                  !releaseCheck.allowed
                    ? releaseCheck.reason
                    : 'Liberar saída do estudante'
                }
              >
                <span>
                  {!releaseCheck.allowed ? 'Vaga Ocupada' : 'Liberar Saída'}
                </span>
              </button>

              <button
                type="button"
                className={`pass-btn-icon-danger ${!isPassAuthor ? 'disabled' : ''}`}
                disabled={!isPassAuthor || isProcessing}
                title={
                  isPassAuthor
                    ? 'Negar Saída'
                    : `Apenas ${student.teacher} pode negar este pedido`
                }
                onClick={() => {
                  if (!isPassAuthor) return;
                  onReject(student.id);
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                  close
                </span>
              </button>
            </>
          ) : (
            <button
              type="button"
              className="pass-btn-primary"
              disabled={isProcessing}
              onClick={handleReturnClick}
            >
              <span>Confirmar Retorno</span>
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
