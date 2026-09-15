import './MetricTile.css';

/**
 * Componente reutilizável de métricas do Stitch Dashboard
 * @param {Object} props
 * @param {string} props.label - Título da métrica
 * @param {string|number} props.value - Valor principal
 * @param {string} [props.unit] - Texto descritivo / unidade ao lado do valor
 * @param {string} props.icon - Nome do ícone Material Symbols
 * @param {'primary' | 'secondary' | 'tertiary' | 'error'} [props.colorScheme='primary']
 */
export default function MetricTile({
  label,
  value,
  unit,
  icon,
  colorScheme = 'primary',
}) {
  return (
    <div className="metric-tile">
      <div className="metric-info">
        <span className="metric-label">{label}</span>
        <div className="metric-value-row">
          <span className={`metric-number ${colorScheme}`}>{value}</span>
          {unit && <span className="metric-unit">{unit}</span>}
        </div>
      </div>

      <div className={`metric-icon-box ${colorScheme}`}>
        <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>
          {icon}
        </span>
      </div>
    </div>
  );
}
