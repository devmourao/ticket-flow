import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import styles from './Sidebar.module.css';

export function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login', { replace: true });
  };

  return (
    <aside className={styles.sidebar}>
      <div className={styles.brand}>
        <h2>Ticket Flow</h2>
      </div>
      
      <nav className={styles.nav}>
        <Link to="/dashboard" className={styles.link}>Tickets Board</Link>
        {/* Aqui está o link que vai fazer o menu aparecer! */}
        <Link to="/dashboard/new" className={styles.link}>+ New Ticket</Link>
      </nav>

      <div className={styles.footer}>
        <button onClick={handleLogout} className={styles.logoutBtn}>
          Sign Out
        </button>
      </div>
    </aside>
  );
}