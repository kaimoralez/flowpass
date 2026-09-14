import Button from '../Button/Button.jsx';
import './Hero.css';

/**
 * Componente Hero de destaque para banners principais
 * @param {Object} props
 * @param {string} props.title - Título principal
 * @param {string} [props.subtitle] - Subtítulo / Categoria
 * @param {string} props.description - Descrição / Chamada principal
 * @param {string} [props.image] - Imagem em destaque
 * @param {React.ReactNode} [props.actions] - Ações/Botões customizados
 */
export default function Hero({
  title,
  subtitle,
  description,
  image,
  actions,
}) {
  return (
    <section className="hero">
      <div className="container hero-grid">
        <div className="hero-content">
          {subtitle && <span className="hero-subtitle">{subtitle}</span>}
          <h1 className="hero-title">{title}</h1>
          <p className="hero-description">{description}</p>
          
          <div className="hero-actions">
            {actions || (
              <>
                <Button variant="primary" size="large">
                  Experimentar Grátis
                </Button>
                <Button variant="outline" size="large">
                  Saber mais
                </Button>
              </>
            )}
          </div>
        </div>

        {image && (
          <div className="hero-image-wrapper">
            <img src={image} alt={title} className="hero-image" />
          </div>
        )}
      </div>
    </section>
  );
}
