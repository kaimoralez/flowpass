import { useState, useMemo } from 'react';
import { useSession } from '../../../context/SessionContext.jsx';
import './NewPassModal.css';

const DESTINATIONS = [
  {
    id: 'banheiro',
    label: 'Banheiro',
    time: '10 min max',
    icon: 'wc',
    color: '#00B4D8',
  },
  {
    id: 'bebedouro',
    label: 'Bebedouro',
    time: '05 min max',
    icon: 'local_drink',
    color: '#2563EB',
  },
  {
    id: 'coordenacao',
    label: 'Coordenação',
    time: '15 min max',
    icon: 'support_agent',
    color: '#F37900',
  },
  {
    id: 'biblioteca',
    label: 'Biblioteca',
    time: '20 min max',
    icon: 'menu_book',
    color: '#B53EA9',
  },
  {
    id: 'enfermaria',
    label: 'Enfermaria / Urgência',
    time: 'Imediato',
    icon: 'medical_services',
    color: '#FF0000',
  },
];

const EM_GRADES = ['1º EM', '2º EM', '3º EM'];

export default function NewPassModal({ isOpen, onClose, onCreatePass, canRelease }) {
  const { session } = useSession();

  const [gender, setGender] = useState('M'); // 'M' = Aluno, 'F' = Aluna
  const [grade, setGrade] = useState('1º EM');
  const [destination, setDestination] = useState(DESTINATIONS[0]);
  const [isPriority, setIsPriority] = useState(false);
  const [note, setNote] = useState('');

  // Professor e Sala predefinidos a partir do acesso
  const teacherName = session?.teacherName || 'Prof. Carlos Eduardo Silveira';
  const roomName = session?.room || 'Sala 204 - Bloco Alpha';

  // Verificação em tempo real da vaga da série e gênero
  const slotStatus = useMemo(() => {
    if (!canRelease) return { allowed: true };
    return canRelease({ grade, gender });
  }, [canRelease, grade, gender]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    onCreatePass({
      gender,
      grade,
      classGroup: `${grade}`,
      room: roomName,
      teacher: teacherName,
      destination: destination.id,
      destinationLabel: destination.label,
      color: destination.color,
      isPriority,
      note: note.trim(),
    });

    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <div>
            <div className="modal-title-row">
              <h2 className="modal-title">Novo Pedido de Saída</h2>
            </div>
            <p className="modal-subtitle">
              Registro Rápido em Sala • Colégio Adventista Asa Sul
            </p>
          </div>

          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Fechar modal"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
              close
            </span>
          </button>
        </div>

        {/* Modal Body Form */}
        <form className="modal-form-body" onSubmit={handleSubmit}>
          {/* Campo 1: Seletor Aluno / Aluna & Série */}
          <div className="access-form-group">
            <label className="access-label">
              <span className="material-symbols-outlined access-label-icon">
                group
              </span>
              Identificação do Estudante
            </label>

            <div className="modal-gender-switcher">
              <button
                type="button"
                className={`modal-gender-btn ${gender === 'M' ? 'active' : ''}`}
                onClick={() => setGender('M')}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                  face
                </span>
                <span>Aluno</span>
              </button>
              <button
                type="button"
                className={`modal-gender-btn ${gender === 'F' ? 'active' : ''}`}
                onClick={() => setGender('F')}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                  face_3
                </span>
                <span>Aluna</span>
              </button>
            </div>
          </div>

          {/* Campo 2: Série / Turma */}
          <div className="access-form-group">
            <label className="access-label">
              <span className="material-symbols-outlined access-label-icon">
                school
              </span>
              Série do Ensino Médio
            </label>
            <select
              className="modal-select-field"
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
            >
              {EM_GRADES.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>

          {/* Campo 3: Dados predefinidos da sala e do professor */}
          <div className="modal-readonly-group">
            <div className="access-form-group">
              <label className="access-label">
                <span className="material-symbols-outlined access-label-icon">
                  badge
                </span>
                Professor(a) Responsável
              </label>
              <input
                type="text"
                className="modal-input-field"
                value={teacherName}
                readOnly
                title="Professor autenticado na sessão"
              />
            </div>

            <div className="access-form-group">
              <label className="access-label">
                <span className="material-symbols-outlined access-label-icon">
                  meeting_room
                </span>
                Sala de Aula
              </label>
              <input
                type="text"
                className="modal-input-field"
                value={roomName}
                readOnly
                title="Sala autenticada na sessão"
              />
            </div>
          </div>

          {/* Destino / Categoria guardado para versão futura */}

          {/* Campo 5: Toggle de Prioridade */}
          <div className="modal-priority-card">
            <div className="modal-priority-left">
              <div className="modal-priority-icon-box">
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                  flag
                </span>
              </div>
              <div className="modal-priority-info">
                <div className="modal-priority-title">Saída Prioritária</div>
                <div className="modal-priority-sub">
                  Atendimento especial no topo da fila
                </div>
              </div>
            </div>

            <label className="modal-switch">
              <input
                type="checkbox"
                checked={isPriority}
                onChange={(e) => setIsPriority(e.target.checked)}
              />
              <span className="modal-slider"></span>
            </label>
          </div>

          {/* Campo 6: Observação opcional */}
          <div className="access-form-group">
            <label className="access-label">
              <span className="material-symbols-outlined access-label-icon">
                edit_note
              </span>
              Observação Breve (opcional)
            </label>
            <input
              type="text"
              className="access-input"
              placeholder="Ex: Ir à coordenação pegar material..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              maxLength={120}
            />
          </div>

          {/* Indicador em tempo real da regra de circulação */}
          <div
            className={`modal-rule-status-box ${
              slotStatus.allowed ? 'free' : 'occupied'
            }`}
          >
            <span
              className="material-symbols-outlined"
              style={{ fontSize: '20px' }}
            >
              {slotStatus.allowed ? 'check_circle' : 'info'}
            </span>
            <span>
              {slotStatus.allowed
                ? `Vaga livre para ${
                    gender === 'M' ? 'Aluno' : 'Aluna'
                  } do ${grade}. Pode ser liberado(a) imediatamente ao chegar na fila.`
                : `${slotStatus.reason} O pedido entrará na fila aguardando o retorno.`}
            </span>
          </div>

          {/* Footer Actions */}
          <div className="modal-footer-actions">
            <button
              type="button"
              className="modal-btn-cancel"
              onClick={onClose}
            >
              Cancelar
            </button>
            <button type="submit" className="modal-btn-confirm">
              <span>Confirmar Pedido</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
