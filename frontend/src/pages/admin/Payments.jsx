import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import GlassCard from '../../components/ui/GlassCard';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPayments = async () => {
    try {
      const res = await api.get('/payments');
      setPayments(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const handleUpdateStatus = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === 'pending' ? 'paid' : 'pending';
      await api.put(`/payments/${id}`, { status: newStatus });
      fetchPayments();
    } catch (err) {
      alert('Error updating payment');
    }
  };

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ margin: 0 }}>Payments Hub</h1>
        <p style={{ color: 'var(--text-muted)' }}>Track student payments and update statuses.</p>
      </div>

      <GlassCard title="All Payments">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="glass-table">
              <thead>
                <tr>
                  <th>Payment ID</th>
                  <th>Student ID</th>
                  <th>Month</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p) => (
                  <tr key={p.id}>
                    <td>#{p.id}</td>
                    <td>{p.student_id}</td>
                    <td><span style={{ fontWeight: 600 }}>{p.month}</span></td>
                    <td>${p.amount}</td>
                    <td>
                      {p.status === 'paid' 
                        ? <Badge variant="success">Paid</Badge>
                        : <Badge variant="warning">Pending</Badge>
                      }
                    </td>
                    <td>
                      <Button 
                        variant="secondary" 
                        style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
                        onClick={() => handleUpdateStatus(p.id, p.status)}
                      >
                        Mark as {p.status === 'pending' ? 'Paid' : 'Pending'}
                      </Button>
                    </td>
                  </tr>
                ))}
                {payments.length === 0 && (
                  <tr><td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>No payments found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </GlassCard>
    </div>
  );
};

export default Payments;
