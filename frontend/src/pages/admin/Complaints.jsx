import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import GlassCard from '../../components/ui/GlassCard';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { CheckCircle } from 'lucide-react';

const Complaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchComplaints = async () => {
    try {
      const res = await api.get('/complaints');
      setComplaints(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const handleResolve = async (id) => {
    try {
      await api.put(`/complaints/${id}`, { status: 'resolved' });
      fetchComplaints();
    } catch (err) {
      alert('Error updating complaint');
    }
  };

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ margin: 0 }}>Complaints Inbox</h1>
        <p style={{ color: 'var(--text-muted)' }}>Review and resolve issues raised by students.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
        {loading ? (
          <p>Loading...</p>
        ) : complaints.map((c) => (
          <GlassCard key={c.id} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Ticket #{c.id}</span>
                <div style={{ fontWeight: '600', marginTop: '0.2rem' }}>Student ID: {c.student_id}</div>
              </div>
              {c.status === 'resolved' 
                ? <Badge variant="success">Resolved</Badge>
                : <Badge variant="warning">Pending</Badge>
              }
            </div>
            
            <div style={{ padding: '1rem', background: 'rgba(0,0,0,0.2)', borderRadius: '8px', flex: 1, marginBottom: '1.5rem' }}>
              <p style={{ margin: 0, lineHeight: 1.5 }}>{c.issue}</p>
            </div>

            {c.status === 'pending' && (
              <Button style={{ width: '100%', padding: '0.5rem' }} onClick={() => handleResolve(c.id)}>
                <CheckCircle size={16} /> Mark as Resolved
              </Button>
            )}
            {c.status === 'resolved' && (
              <Button variant="secondary" style={{ width: '100%', padding: '0.5rem', opacity: 0.5 }} disabled>
                Resolved
              </Button>
            )}
          </GlassCard>
        ))}
        {!loading && complaints.length === 0 && (
          <p style={{ color: 'var(--text-muted)' }}>Hooray, no complaints!</p>
        )}
      </div>
    </div>
  );
};

export default Complaints;
