import './GradeFilter.css';

const GRADES = [
  { id: 'all', label: 'Todos' },
  { id: '1º EM', label: '1º EM' },
  { id: '2º EM', label: '2º EM' },
  { id: '3º EM', label: '3º EM' },
];

export default function GradeFilter({ selectedGrade, onSelectGrade }) {
  return (
    <div className="grade-filter-bar" role="tablist" aria-label="Filtro de Séries do Ensino Médio">
      {GRADES.map((grade) => (
        <button
          key={grade.id}
          type="button"
          role="tab"
          aria-selected={selectedGrade === grade.id}
          className={`grade-filter-btn ${selectedGrade === grade.id ? 'active' : ''}`}
          onClick={() => onSelectGrade(grade.id)}
        >
          {grade.label}
        </button>
      ))}
    </div>
  );
}
