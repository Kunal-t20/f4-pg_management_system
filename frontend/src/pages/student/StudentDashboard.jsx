import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { Home, CreditCard, AlertCircle } from 'lucide-react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import GlassCard from '../../components/ui/GlassCard';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

export const StudentContext = React.createContext();

const StudentDashboard = () => {
  const { user } = useAuth();
  const [studentProfile, setStudentProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCreateProfile, setShowCreateProfile] = useState(false);
  const [phone, setPhone] = useState('');

  const fetchProfile = async () => {
    try {
      const res = await api.get('/students');
      const profile = res.data.find(s => s.user_id === user.user_id);
      if (profile) {
        setStudentProfile(profile);
      } else {
        setShowCreateProfile(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [user]);

  const handleCreateProfile = async (e) => {
    e.preventDefault();
    try {
      await api.post('/students', { user_id: user.user_id, phone });
      setShowCreateProfile(false);
      fetchProfile();
    } catch (err) {
      alert('Error creating profile');
    }
  };

  const navItems = [
    { path: '/student', exact: true, label: 'Overview', icon: <Home size={20} /> },
    { path: '/student/payments', exact: false, label: 'My Payments', icon: <CreditCard size={20} /> },
    { path: '/student/complaints', exact: false, label: 'My Complaints', icon: <AlertCircle size={20} /> },
  ];

  if (loading) return <div style={{ padding: '2rem', color: 'white' }}>Loading Profile...</div>;

  if (showCreateProfile) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: 'var(--bg-darker)' }}>
        <GlassCard style={{ width: '400px' }} title="Complete Registration">
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Please complete your student profile to access the dashboard.</p>
          <form onSubmit={handleCreateProfile}>
            <Input label="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} required />
            <Button type="submit" variant="primary" style={{ width: '100%', marginTop: '1rem' }}>Create Profile</Button>
          </form>
        </GlassCard>
      </div>
    );
  }

  return (
    <StudentContext.Provider value={{ studentProfile }}>
      <DashboardLayout role="student" navItems={navItems} />
    </StudentContext.Provider>
  );
};

export default StudentDashboard;
