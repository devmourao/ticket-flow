import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import styles from './TicketBoard.module.css';

interface Ticket {
  id: string;
  title: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved';
  created_at: string;
}

export function TicketBoard() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const { data, error: fetchError } = await supabase
        .from('tickets')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setTickets(data || []);
    } catch (err: any) {
      setError(err.message || 'Error fetching tickets');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className={styles.loading}>Loading tickets...</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <div className={styles.board}>
      <div className={styles.header}>
        <h1>Tickets Board</h1>
        <p>Manage and track your support requests.</p>
      </div>

      {tickets.length === 0 ? (
        <div className={styles.empty}>
          <p>No tickets found. Open a new ticket to get started!</p>
        </div>
      ) : (
        <div className={styles.grid}>
          {tickets.map((ticket) => (
            <div key={ticket.id} className={styles.card}>
              <div className={styles.cardHeader}>
                <span className={`${styles.statusBadge} ${styles[ticket.status]}`}>
                  {ticket.status.replace('_', ' ').toUpperCase()}
                </span>
                <span className={styles.date}>
                  {new Date(ticket.created_at).toLocaleDateString()}
                </span>
              </div>
              <h3 className={styles.title}>{ticket.title}</h3>
              <p className={styles.description}>{ticket.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}