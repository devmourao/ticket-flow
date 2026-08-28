import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import styles from './TicketBoard.module.css';

interface Ticket {
  id: string;
  title: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved';
  created_at: string;
  assigned_to: string | null;
}

export function TicketBoard() {
  const { user, activeRole } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTickets();
  }, [activeRole]); 

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('tickets')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTickets(data || []);
    } catch (error) {
      console.error('Error fetching tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateTicketStatus = async (ticketId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('tickets')
        .update({ status: newStatus })
        .eq('id', ticketId);

      if (error) throw error;
      setTickets(tickets.map(t => t.id === ticketId ? { ...t, status: newStatus as any } : t));
    } catch (error: any) {
      alert(`Action Denied: ${error.message}`);
    }
  };

  const handleAssignToMe = async (ticketId: string) => {
    if (!user) return;
    try {
      const { error } = await supabase
        .from('tickets')
        .update({ assigned_to: user.id })
        .eq('id', ticketId);

      if (error) throw error;
      setTickets(tickets.map(t => t.id === ticketId ? { ...t, assigned_to: user.id } : t));
    } catch (error: any) {
      alert(`Action Denied: ${error.message}`);
    }
  };

  if (loading) {
    return <div className={styles.loading}>Loading tickets...</div>;
  }



if (loading) {
    return <div className={styles.loading}>Loading tickets...</div>;
  }

  const isClient = activeRole === 'client';
  const canAssign = activeRole === 'agent' || activeRole === 'admin' || activeRole === 'demo';


  const getBoardTitle = () => {
    if (activeRole === 'client') return 'My Tickets';
    if (activeRole === 'agent') return 'Ticket Queue';
    return 'All Tickets';
  };

  const getBoardDescription = () => {
    if (activeRole === 'client') return 'Track the status of your support requests.';
    if (activeRole === 'agent') return 'Manage your assigned tasks and open requests.';
    return 'Global overview of all system tickets.';
  };

  return (
    <div className={styles.board}>
   
      <div className={styles.header}>
        <h1>{getBoardTitle()}</h1>
        <p>{getBoardDescription()}</p>
      </div>

      <div className={styles.grid}>
        {tickets.length === 0 ? (
          <div className={styles.emptyState}>No tickets found.</div>
        ) : (
          tickets.map((ticket) => (
            <div key={ticket.id} className={styles.card}>
              
              <div className={styles.cardHeader}>
                <span className={`${styles.badge} ${styles[ticket.status]}`}>
                  {ticket.status.replace('_', ' ').toUpperCase()}
                </span>
                <span className={styles.date}>
                  {new Date(ticket.created_at).toLocaleDateString()}
                </span>
              </div>
              
              <h3 className={styles.title}>{ticket.title}</h3>
              <p className={styles.description}>{ticket.description}</p>
              
              <div className={styles.cardFooter}>
                
             
                {isClient ? (
                  ticket.status === 'resolved' ? (
                    <button 
                      onClick={() => updateTicketStatus(ticket.id, 'open')}
                      className={styles.reopenBtn}
                    >
                      ↺ Reopen Ticket
                    </button>
                  ) : (
                    <span className={styles.lockedStatus}>Status Locked (Staff Only)</span>
                  )
                ) : (
                 
                  <select
                    value={ticket.status}
                    onChange={(e) => updateTicketStatus(ticket.id, e.target.value)}
                    className={styles.statusSelect}
                  >
                    <option value="open">Open</option>
                    <option value="in_progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                  </select>
                )}

              
                {canAssign && (
                  <div className={styles.assignmentArea}>
                    {ticket.assigned_to === user?.id ? (
                      <span className={styles.assignedBadge}>👤 You</span>
                    ) : ticket.assigned_to ? (
                      <span className={styles.assignedBadgeTaken}>Assigned</span>
                    ) : (
                      <button 
                        onClick={() => handleAssignToMe(ticket.id)} 
                        className={styles.assignBtn}
                      >
                        Assign to me
                      </button>
                    )}
                  </div>
                )}

              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}