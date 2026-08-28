import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth, type Role, type Profile } from '../../contexts/AuthContext';
import styles from './UserBoard.module.css';

export function UserBoard() {
  const { activeRole } = useAuth();
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .order('full_name', { ascending: true });

      if (fetchError) throw fetchError;
      setUsers(data || []);
    } catch (err: any) {
      setError(err.message || 'Error fetching users');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: Role) => {
    try {
      
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId);

      
      if (updateError) throw updateError; 

      
      setUsers(users.map(u => 
        u.id === userId ? { ...u, role: newRole } : u
      ));
      
      alert('User role updated successfully!');
    } catch (err: any) {
      alert(`Action Denied: ${err.message}. \n\nIf you are using a Demo account, you cannot modify database records.`);
    }
  };

  
  if (activeRole !== 'admin') {
    return (
      <div className={styles.unauthorized}>
        <h2>Unauthorized Access</h2>
        <p>You must be an Administrator to view this page.</p>
      </div>
    );
  }

  if (loading) return <div className={styles.loading}>Loading users...</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <div className={styles.board}>
      <div className={styles.header}>
        <h1>User Management</h1>
        <p>Manage system access and assign roles to your team members.</p>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>System Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map((userProfile) => (
              <tr key={userProfile.id}>
                <td className={styles.nameCell}>
                  {userProfile.full_name || 'Unnamed User'}
                </td>
                <td className={styles.idCell}>
                  {userProfile.email || 'No email registered'} {/* <-- Alterado aqui */}
                </td>
                <td className={styles.actionCell}>
                  <select 
                    value={userProfile.role}
                    onChange={(e) => handleRoleChange(userProfile.id, e.target.value as Role)}
                    className={`${styles.roleSelect} ${styles[userProfile.role]}`}
                  >
                    <option value="client">Client</option>
                    <option value="agent">Agent</option>
                    <option value="admin">Admin</option>
                    <option value="demo">Demo (Read-Only)</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}