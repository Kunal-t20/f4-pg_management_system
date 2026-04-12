import React, { useState, useEffect, useContext } from 'react';
import api from '../../api/axios';
import GlassCard from '../../components/ui/GlassCard';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { StudentContext } from './StudentDashboard';

const StudentPayments = () => {
  const { studentProfile } = useContext(StudentContext);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [amount, setAmount] = useState('');
  const [month, setMonth] = useState('');

  const fetchPayments = async () => {
    try {
      const res = await api.get(`/payments/student/${studentProfile.id}`);
      setPayments(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [studentProfile]);

  const handlePay = async (e) => {
    e.preventDefault();
    try {
      await api.post('/payments', {
        student_id: studentProfile.id,
        amount: parseFloat(amount),
        month
      });
      setAmount('');
      setMonth('');
      fetchPayments();
    } catch (err) {
      alert('Error submitting payment');
    }
  };

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ margin: 0 }}>My Payments</h1>
        <p style={{ color: 'var(--text-muted)' }}>Manage and view your rent payments.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'reap', gap: '2rem' }}>
        <GlassCard title="Submit New Payment" style={{ marginBottom: '2rem' }}>
          <form onSubmit={handlePay} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
            <div style={{ flex: 1, minWidth: '200px' }}>
              <Input label="Amount ($)" type="number" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} required />
            </div>
            <div style={{ flex: 1, minWidth: '200px' }}>
              <Input label="Month (e.g. October 2023)" value={month} onChange={(e) => setMonth(e.target.value)} required />
            </div>
            <div style={{ paddingBottom: '1rem' }}>
              <Button type="submit" variant="primary">Submit Payment</Button>
            </div>
          </form>
        </GlassCard>

        <GlassCard title="Payment History">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table className="glass-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Month</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map(p => (
                    <tr key={p.id}>
                      <td>#{p.id}</td>
                      <td>{p.month}</td>
                      <td>${p.amount}</td>
                      <td>
                        {p.status === 'paid' 
                          ? <Badge variant="success">Paid</Badge> 
                          : <Badge variant="warning">Pending Admin Approval</Badge>}
                      </td>
                    </tr>
                  ))}
                  {payments.length === 0 && (
                    <tr><td colSpan="4" style={{ textAlign: 'center', padding: '2rem' }}>No payment history.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </GlassCard>
      </div>
    </div>
  );
};

export default StudentPayments;
