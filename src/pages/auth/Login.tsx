import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useNavigate } from 'react-router-dom';
import styles from './Login.module.css';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: 'guest@ticketflow.com',
        password: 'Teste123456',
      });
      if (error) throw error;
      navigate('/dashboard');
    } catch (err: any) {
      setError('Failed to login as guest. Please ensure the guest account exists.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginPage}>
      <div className={styles.container}>
        
     
        <div className={styles.infoPanel}>
          <div className={styles.branding}>
            <h1>Ticket Flow</h1>
            <span className={styles.version}>v1.0</span>
          </div>
          
          <div className={styles.description}>
            <p>
              A full-stack Help Desk platform built with <strong>React</strong> and <strong>Supabase</strong>.
            </p>
            <p>
              This project demonstrates advanced Role-Based Access Control (RBAC), database security (Row Level Security), and seamless UI state management.
            </p>
          </div>

          <div className={styles.demoNotice}>
            <h3>👋 Welcome!</h3>
            <p>
              You don't need to create a real account. Use the <strong>Demo Account</strong> to explore the application through different perspectives (Client, Agent, and Admin).
            </p>
          </div>

          <div className={styles.links}>
            <a href="https://github.com/devmourao/ticket-flow" target="_blank" rel="noopener noreferrer" className={styles.linkBtn}>
              <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
              GitHub Repository
            </a>
            <a href="https://dev.mourao.info" target="_blank" rel="noopener noreferrer" className={styles.linkBtn}>
              <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
              dev.mourao.info
            </a>
          </div>
        </div>

        {/* LADO DIREITO: Formulário */}
        <div className={styles.formPanel}>
          <div className={styles.formHeader}>
            <h2>Sign In</h2>
            <p>Access your dashboard</p>
          </div>

          {error && <div className={styles.errorAlert}>{error}</div>}

          <form className={styles.form} onSubmit={handleLogin}>
            <div className={styles.formGroup}>
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                required
              />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>

          <div className={styles.divider}>
            <span>OR</span>
          </div>

          <button 
            type="button" 
            onClick={handleGuestLogin} 
            className={styles.demoBtn}
            disabled={loading}
          >
            Login as Demo Account (Read-Only)
          </button>
        </div>
      </div>
    </div>
  );
}