import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import styles from './Profile.module.css';

export function Profile() {
  const { user, profile } = useAuth();
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    if (profile?.full_name) {
      setFullName(profile.full_name);
    }
  }, [profile]);

  const handleUpdateProfile = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;
    
    setLoading(true);
    setMessage(null);

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ full_name: fullName })
        .eq('id', user.id);

      if (error) throw error;
      
      setMessage({ type: 'success', text: 'Profile updated successfully! Refresh the page to see changes in the sidebar.' });
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Failed to update profile.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>My Profile</h1>
          <p>Manage your account settings and preferences.</p>
        </div>

        {message && (
          <div className={`${styles.alert} ${styles[message.type]}`}>
            {message.text}
          </div>
        )}

<form onSubmit={handleUpdateProfile} className={styles.form}>
       
          <div className={styles.formGroup}>
            <label htmlFor="fullName">Full Name</label>
            <input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="E.g., Marcos Mourão"
              required
            />
          </div>

          {/* 2. Email (Trancado) */}
          <div className={styles.formGroup}>
            <label htmlFor="email">Email Address</label>
            <input 
              id="email" 
              type="email" 
              value={user?.email || ''} 
              disabled 
              className={styles.disabledInput}
            />
            <span className={styles.hint}>Email cannot be changed here.</span>
          </div>

          {/* 3. Role (Trancado) */}
          <div className={styles.formGroup}>
            <label htmlFor="role">Account Role</label>
            <input 
              id="role" 
              type="text" 
              value={profile?.role ? profile.role.toUpperCase() : ''} 
              disabled 
              className={styles.disabledInput}
            />
            <span className={styles.hint}>Your permission level is defined by an Administrator.</span>
          </div>

          <div className={styles.actions}>
            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}