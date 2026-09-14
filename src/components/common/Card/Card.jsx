import './Card.css';

/**
 * Componente de Card Reutilizável
 * @param {Object} props
 * @param {string} props.title - Título do card (obrigatório)
 * @param {string} [props.subtitle] - Subtítulo do card
 * @param {string} props.description - Descrição do conteúdo (obrigatório)
 * @param {string} [props.image] - URL da imagem do card
 * @param {string} [props.badge] - Etiqueta superior
 * @param {React.ReactNode} [props.footer] - Conteúdo customizado no rodapé do card
 * @param {function} [props.onClick] - Manipulador de clique no card
 */
export default function Card({
  title,
  subtitle,
  description,
  image,
  badge,
  footer,
  onClick,
  ...restProps
}) {
  const isClickable = Boolean(onClick);

  return (
    <article
      className={`card ${isClickable ? 'card-clickable' : ''}`}
      onClick={onClick}
      {...restProps}
    >
      {image && (
        <div className="card-image-container">
          <img src={image} alt={title} className="card-image" loading="lazy" />
        </div>
      )}

      <div className="card-content">
        {badge && <span className="card-badge">{badge}</span>}
        {subtitle && <span className="card-subtitle">{subtitle}</span>}
        <h3 className="card-title">{title}</h3>
        <p className="card-description">{description}</p>
      </div>

      {footer && <div className="card-footer">{footer}</div>}
    </article>
  );
}
