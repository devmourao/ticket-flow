import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import styles from './NewTicket.module.css';

export function NewTicket() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
    
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error('User not authenticated');

      
      const { error: insertError } = await supabase
        .from('tickets')
        .insert([
          {
            title,
            description,
            created_by: user.id,
            
          }
        ]);

      if (insertError) throw insertError;

      // 3. Sucesso! Volta para o painel principal
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to create ticket.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Open New Ticket</h1>
        <p>Describe your issue in detail so our agents can help you.</p>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="title">Subject</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="E.g., Cannot access the billing portal"
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Provide as much context as possible..."
            rows={6}
            required
          />
        </div>

        {error && <p className={styles.error}>{error}</p>}

        <div className={styles.actions}>
          <button 
            type="button" 
            className={styles.cancelBtn} 
            onClick={() => navigate('/dashboard')}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className={styles.submitBtn} 
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Submit Ticket'}
          </button>
        </div>
      </form>
    </div>
  );
}