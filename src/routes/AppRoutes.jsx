import { Routes, Route } from 'react-router-dom';
import AccessPage from '../pages/Access/AccessPage.jsx';
import DashboardPage from '../pages/Dashboard/DashboardPage.jsx';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Tela Inicial: Tela de Acesso Centralizada (Stitch) */}
      <Route path="/" element={<AccessPage />} />

      {/* Painel Principal: Dashboard de Circulação em Tempo Real */}
      <Route path="/dashboard" element={<DashboardPage />} />
    </Routes>
  );
}
