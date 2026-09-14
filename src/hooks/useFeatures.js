import { useState, useMemo } from 'react';

const INITIAL_FEATURES = [
  {
    id: 1,
    title: 'Acesso VIP & Passes',
    subtitle: 'Gestão Inteligente',
    description: 'Crie e gerencie credenciais digitais com validação instantânea via QR Code em tempo real.',
    badge: 'Popular',
    category: 'acesso',
  },
  {
    id: 2,
    title: 'Fluxos Automatizados',
    subtitle: 'Automação sem Código',
    description: 'Configure regras de aprovação e gatilhos para liberação de acessos sem complicação.',
    badge: 'Novo',
    category: 'automacao',
  },
  {
    id: 3,
    title: 'Relatórios & Analytics',
    subtitle: 'Métricas em Tempo Real',
    description: 'Acompanhe a frequência de acessos, picos de entrada e relatórios de auditoria completa.',
    badge: 'Essencial',
    category: 'analytics',
  },
  {
    id: 4,
    title: 'Integrações via API',
    subtitle: 'Desenvolvedores',
    description: 'Conecte o Flowpass com seus sistemas existentes utilizando nossos webhooks e API REST.',
    badge: 'API',
    category: 'automacao',
  },
];

export default function useFeatures() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredFeatures = useMemo(() => {
    return INITIAL_FEATURES.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === 'all' || item.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  return {
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    features: filteredFeatures,
    totalCount: filteredFeatures.length,
  };
}
