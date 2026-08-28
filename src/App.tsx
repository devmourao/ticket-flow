import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext'; 
import { Login } from './pages/auth/Login';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { NewTicket } from './pages/dashboard/NewTicket';
import { TicketBoard } from './pages/dashboard/TicketBoard';
import { Profile } from './pages/dashboard/Profile';
import { UserBoard } from './pages/dashboard/UserBoard';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route element={<ProtectedRoute />}>
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<TicketBoard />} />
              <Route path="/dashboard/new" element={<NewTicket />} />
              <Route path="/dashboard/profile" element={<Profile />} />
              <Route path="/dashboard/users" element={<UserBoard />} />
            </Route>
          </Route>
          
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;