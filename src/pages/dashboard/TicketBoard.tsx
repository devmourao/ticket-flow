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
  created_by: string;
}

export function TicketBoard() {
  const { user, activeRole } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);


  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(5);

  useEffect(() => {
    fetchTickets();
  }, [activeRole]);


  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, activeRole, itemsPerPage]);

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

  const isClient = activeRole === 'client';
  const canAssign = activeRole === 'agent' || activeRole === 'admin' || activeRole === 'demo';


  const rbacFilteredTickets = tickets.filter(ticket => {
    if (activeRole === 'admin') return true;
    if (activeRole === 'client') return ticket.created_by === user?.id;
    if (activeRole === 'agent') return ticket.assigned_to === null || ticket.assigned_to === user?.id;
    return false;
  });


  const metrics = {
    total: rbacFilteredTickets.length,
    open: rbacFilteredTickets.filter(t => t.status === 'open').length,
    resolved: rbacFilteredTickets.filter(t => t.status === 'resolved').length,
  };


  const displayTickets = rbacFilteredTickets.filter(ticket => {
    if (statusFilter === 'all') return true;
    return ticket.status === statusFilter;
  });


  const totalPages = Math.ceil(displayTickets.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentTickets = displayTickets.slice(startIndex, startIndex + itemsPerPage);

  const getBoardTitle = () => {
    if (activeRole === 'client') return 'My Tickets';
    if (activeRole === 'agent') return 'Ticket Queue';
    return 'All Tickets';
  };

  return (
    <div className={styles.board}>
      <div className={styles.header}>
        <div>
          <h1>{getBoardTitle()}</h1>
          <p>
            {activeRole === 'client' 
              ? 'Track the status of your support requests.' 
              : 'Manage your assigned tasks and open requests.'}
          </p>
        </div>
        

        {!isClient && (
          <div className={styles.filterControl}>
            <label>Filter by Status:</label>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="all">All Tickets</option>
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
        )}
      </div>


      <div className={styles.metricsContainer}>
        <div className={styles.metricCard}>
          <span className={styles.metricLabel}>Total Tickets</span>
          <strong className={styles.metricValue}>{metrics.total}</strong>
        </div>
        <div className={styles.metricCard}>
          <span className={styles.metricLabel}>Needs Action (Open)</span>
          <strong className={`${styles.metricValue} ${styles.textWarning}`}>{metrics.open}</strong>
        </div>
        <div className={styles.metricCard}>
          <span className={styles.metricLabel}>Resolved</span>
          <strong className={`${styles.metricValue} ${styles.textSuccess}`}>{metrics.resolved}</strong>
        </div>
      </div>

      <div className={styles.grid}>
        {currentTickets.length === 0 ? (
          <div className={styles.emptyState}>No tickets found for the current filters.</div>
        ) : (
          currentTickets.map((ticket) => (
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
                    <button onClick={() => updateTicketStatus(ticket.id, 'open')} className={styles.reopenBtn}>
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
                      <button onClick={() => handleAssignToMe(ticket.id)} className={styles.assignBtn}>
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

  
      {displayTickets.length > 0 && (
        <div className={styles.paginationArea}>
          <div className={styles.pageSettings}>
            <label>Items per page:</label>
            <select value={itemsPerPage} onChange={(e) => setItemsPerPage(Number(e.target.value))}>
              <option value={2}>2</option> 
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>
          </div>
          
          <div className={styles.pageControls}>
            <button 
              disabled={currentPage === 1} 
              onClick={() => setCurrentPage(p => p - 1)}
            >
              ← Previous
            </button>
            <span className={styles.pageInfo}>
              Page {currentPage} of {totalPages || 1}
            </span>
            <button 
              disabled={currentPage === totalPages} 
              onClick={() => setCurrentPage(p => p + 1)}
            >
              Next →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}