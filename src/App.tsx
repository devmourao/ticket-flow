import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './pages/auth/Login';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { NewTicket } from './pages/dashboard/NewTicket';
import { TicketBoard } from './pages/dashboard/TicketBoard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        {/* Rotas Protegidas */}
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            
            {/* Rota base do Dashboard */}
              <Route path="/dashboard" element={<TicketBoard />} />
            
            
            {/* Nossa nova rota do Formulário */}
            <Route path="/dashboard/new" element={<NewTicket />} />
            {/* Rota base do Dashboard */}
          
            
          </Route>
        </Route>
        
        {/* Fallback: Qualquer rota desconhecida vai para Login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;