import { Routes, Route } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout/MainLayout.jsx';
import Home from '../pages/Home/Home.jsx';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        {/* Futuras rotas serão adicionadas aqui mediante solicitação */}
      </Route>
    </Routes>
  );
}
