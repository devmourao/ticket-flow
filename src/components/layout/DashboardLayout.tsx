import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import styles from './DashboardLayout.module.css';

export function DashboardLayout() {
  return (
    <div className={styles.container}>
      <Sidebar />
      <main className={styles.mainContent}>
        <Outlet />
      </main>
    </div>
  );
}