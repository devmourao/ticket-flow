import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth, type Role } from '../../contexts/AuthContext';
import styles from './Sidebar.module.css';

export function Sidebar() {
  const navigate = useNavigate();
  const { profile, activeRole, setActiveRole } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login', { replace: true });
  };

  const getInitials = (name: string | null | undefined) => {
    return name ? name.charAt(0).toUpperCase() : 'U';
  };

  const canSwitchRoles = profile?.role === 'admin' || profile?.role === 'demo';

  const handleRoleChange = (role: Role) => {
    setActiveRole(role);
    setIsDropdownOpen(false);
  };

  return (
    <aside className={styles.sidebar}>
      <div className={styles.brand}>
        <h2>Ticket Flow</h2>
      </div>
      
      <nav className={styles.nav}>
        <Link to="/dashboard" className={styles.link}>Tickets Board</Link>
        <Link to="/dashboard/new" className={styles.link}>+ New Ticket</Link>
        
       
        {activeRole === 'admin' && (
          <Link to="/dashboard/users" className={styles.link}>Users (Admin)</Link>
        )}
      </nav>

  
      <div className={styles.footer}>
        
        {isDropdownOpen && (
          <div className={styles.dropdown}>
            <div className={styles.dropdownSection}>
              <Link to="/dashboard/profile" className={styles.dropdownItem} onClick={() => setIsDropdownOpen(false)}>
                My Profile
              </Link>
            </div>

            {canSwitchRoles && (
              <div className={styles.dropdownSection}>
                <span className={styles.dropdownLabel}>View As:</span>
                <button 
                  className={`${styles.dropdownItem} ${activeRole === 'admin' ? styles.active : ''}`}
                  onClick={() => handleRoleChange('admin')}
                >
                  Admin
                </button>
                <button 
                  className={`${styles.dropdownItem} ${activeRole === 'agent' ? styles.active : ''}`}
                  onClick={() => handleRoleChange('agent')}
                >
                  Agent
                </button>
                <button 
                  className={`${styles.dropdownItem} ${activeRole === 'client' ? styles.active : ''}`}
                  onClick={() => handleRoleChange('client')}
                >
                  Client
                </button>
              </div>
            )}

            <div className={styles.dropdownSection}>
              <button onClick={handleLogout} className={`${styles.dropdownItem} ${styles.logoutText}`}>
                Sign Out
              </button>
            </div>
          </div>
        )}

        <div className={styles.userWidget} onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
          <div className={styles.avatar}>
            {getInitials(profile?.full_name)}
          </div>
          <div className={styles.userInfo}>
            <span className={styles.userName}>{profile?.full_name || 'Loading...'}</span>
            <span className={styles.userRole}>
              {activeRole ? activeRole.toUpperCase() : ''}
            </span>
          </div>
          <div className={styles.chevron}>
            {isDropdownOpen ? '▼' : '▲'}
          </div>
        </div>

      </div>
    </aside>
  );
}