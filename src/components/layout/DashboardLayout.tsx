import { Outlet, useNavigate } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { useAuth } from '../../contexts/AuthContext';
import styles from './DashboardLayout.module.css';

export function DashboardLayout() {
  const { profile, activeRole, setActiveRole } = useAuth();
  const navigate = useNavigate();

  const isImpersonating = profile && activeRole && profile.role !== activeRole;

  const handleRevertRole = () => {
    if (profile) setActiveRole(profile.role);
    navigate('/dashboard');
  };

  const handleRoleSelection = (role: any) => {
    setActiveRole(role);
    navigate('/dashboard'); // <-- Redireciona para a Home
  };


  if (activeRole === 'demo') {
    return (
      <div className={styles.welcomeOverlay}>
        <div className={styles.welcomeModal}>
          <h2>Welcome to Ticket Flow! 🚀</h2>
          <p className={styles.welcomeSubtitle}>
            To explore the platform's features, please select a perspective. 
            <br/>You can change this at any time during your test.
          </p>
          
          <div className={styles.roleCardsContainer}>

            <button className={styles.roleCard} onClick={() => handleRoleSelection('admin')}>
              <span className={styles.roleIcon}>👑</span>
               <h3>Administrator</h3>
              <p>Full access. Manage users and oversee all system tickets.</p>
              
            </button>
            
            <button className={styles.roleCard} onClick={() => handleRoleSelection('agent')}>
              <span className={styles.roleIcon}>🎧</span>
              <h3>Support Agent</h3>
              <p>Access the queue, assign tickets to yourself, and resolve issues.</p>
            </button>
            
            <button className={styles.roleCard} onClick={() => handleRoleSelection('client')}>
              <span className={styles.roleIcon}>👤</span>
              <h3>Client</h3>
              <p>Create new support requests and track their resolution status.</p>
            </button>
          </div>
        </div>
      </div>
    );
  }


  return (
    <div className={styles.layout}>
      <Sidebar />
      <div className={styles.mainContent}>
        
        {isImpersonating && (
          <div className={styles.impersonationBanner}>
            <span>
              👁️ <strong>Impersonation Mode:</strong> You are viewing the system as a <strong>{activeRole.toUpperCase()}</strong>.
            </span>
            <button onClick={handleRevertRole} className={styles.revertBtn}>
              {profile.role === 'demo' ? 'Change Role' : `Back to ${profile.role.toUpperCase()}`}
            </button>
          </div>
        )}

        <main className={styles.pageContent}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}