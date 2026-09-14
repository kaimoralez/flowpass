import Hero from '../../components/common/Hero/Hero.jsx';
import Card from '../../components/common/Card/Card.jsx';
import Button from '../../components/common/Button/Button.jsx';
import useFeatures from '../../hooks/useFeatures.js';
import './Home.css';

export default function Home() {
  const {
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    features,
    totalCount,
  } = useFeatures();

  return (
    <div>
      {/* Banner Principal utilizando Hero com props */}
      <Hero
        title="Gestão de Acessos e Passes Simplificada"
        subtitle="Plataforma Flowpass"
        description="Automatize autorizações, controle fluxos em tempo real e elimine filas com a melhor infraestrutura de credenciamento digital."
      />

      {/* Seção de Recursos com Filtros e Cards */}
      <section id="features" className="container section-padding">
        <div className="home-features-section">
          <div className="home-section-header">
            <h2>Explore os Recursos do Flowpass</h2>
            <p>Descubra como nossa tecnologia eleva a eficiência do seu controle de acesso.</p>
          </div>

          <div className="home-controls">
            <input
              type="text"
              placeholder="Buscar recursos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="home-search-input"
              aria-label="Buscar recursos"
            />

            <div className="home-filter-buttons">
              <Button
                variant={selectedCategory === 'all' ? 'primary' : 'secondary'}
                size="small"
                onClick={() => setSelectedCategory('all')}
              >
                Todos
              </Button>
              <Button
                variant={selectedCategory === 'acesso' ? 'primary' : 'secondary'}
                size="small"
                onClick={() => setSelectedCategory('acesso')}
              >
                Acesso
              </Button>
              <Button
                variant={selectedCategory === 'automacao' ? 'primary' : 'secondary'}
                size="small"
                onClick={() => setSelectedCategory('automacao')}
              >
                Automação
              </Button>
              <Button
                variant={selectedCategory === 'analytics' ? 'primary' : 'secondary'}
                size="small"
                onClick={() => setSelectedCategory('analytics')}
              >
                Analytics
              </Button>
            </div>
          </div>

          {/* Grid de Cards com props title, subtitle, description */}
          {totalCount > 0 ? (
            <div className="home-grid">
              {features.map((item) => (
                <Card
                  key={item.id}
                  title={item.title}
                  subtitle={item.subtitle}
                  description={item.description}
                  badge={item.badge}
                />
              ))}
            </div>
          ) : (
            <div className="home-empty-state">
              <p>Nenhum recurso encontrado para "{searchTerm}".</p>
            </div>
          )}

          {/* Seção Call-to-Action Final */}
          <div className="home-cta-section">
            <h2>Pronto para transformar a gestão de acessos?</h2>
            <p>Comece a utilizar o Flowpass gratuitamente hoje mesmo e escale com segurança.</p>
            <Button variant="primary" size="large">
              Criar Conta Gratuita
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
