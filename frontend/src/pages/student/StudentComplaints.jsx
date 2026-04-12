import React, { useState, useEffect, useContext } from 'react';
import api from '../../api/axios';
import GlassCard from '../../components/ui/GlassCard';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { StudentContext } from './StudentDashboard';

const StudentComplaints = () => {
  const { studentProfile } = useContext(StudentContext);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [issue, setIssue] = useState('');

  const fetchComplaints = async () => {
    try {
      const res = await api.get(`/complaints/student/${studentProfile.id}`);
      setComplaints(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, [studentProfile]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/complaints', {
        student_id: studentProfile.id,
        issue
      });
      setIssue('');
      fetchComplaints();
    } catch (err) {
      alert('Error submitting complaint');
    }
  };

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ margin: 0 }}>My Complaints</h1>
        <p style={{ color: 'var(--text-muted)' }}>Report issues and track their resolution status.</p>
      </div>

      <GlassCard title="Report an Issue" style={{ marginBottom: '2rem' }}>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Issue Description</label>
            <textarea 
              value={issue}
              onChange={(e) => setIssue(e.target.value)}
              required
              rows="4"
              style={{
                width: '100%', padding: '0.75rem', background: 'rgba(15,23,42,0.6)',
                border: '1px solid var(--glass-border)', borderRadius: '8px',
                color: 'var(--text-main)', fontFamily: 'inherit', resize: 'vertical'
              }}
              placeholder="Describe the problem you are facing..."
            ></textarea>
          </div>
          <Button type="submit" variant="primary">Submit Complaint</Button>
        </form>
      </GlassCard>

      <GlassCard title="Complaint History">
        {loading ? <p>Loading...</p> : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {complaints.map(c => (
              <div key={c.id} style={{ padding: '1rem', background: 'rgba(0,0,0,0.2)', borderRadius: '8px', borderLeft: `4px solid ${c.status === 'resolved' ? 'var(--success)' : 'var(--warning)'}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Posted Issue #{c.id}</span>
                  {c.status === 'resolved' ? <Badge variant="success">Resolved</Badge> : <Badge variant="warning">Pending</Badge>}
                </div>
                <p style={{ margin: 0 }}>{c.issue}</p>
              </div>
            ))}
            {complaints.length === 0 && <p style={{ color: 'var(--text-muted)' }}>You haven't reported any issues.</p>}
          </div>
        )}
      </GlassCard>
    </div>
  );
};

export default StudentComplaints;
