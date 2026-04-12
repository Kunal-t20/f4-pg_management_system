import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import GlassCard from '../components/ui/GlassCard';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { UserPlus } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await api.post('/register', formData);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', padding: '2rem', overflow: 'hidden' }}>
      {/* Decorative Orbs */}
      <div style={{ position: 'absolute', top: '15%', right: '15%', width: '350px', height: '350px', background: 'var(--secondary-color)', borderRadius: '50%', filter: 'blur(120px)', opacity: 0.12, zIndex: 0, animation: 'spin 15s linear infinite' }}></div>
      <div style={{ position: 'absolute', bottom: '5%', left: '10%', width: '250px', height: '250px', background: 'var(--primary-color)', borderRadius: '50%', filter: 'blur(100px)', opacity: 0.15, zIndex: 0, animation: 'spin 10s reverse linear infinite' }}></div>

      <GlassCard className="animate-fade-in" style={{ width: '100%', maxWidth: '450px', padding: '3rem 2.5rem', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ 
            display: 'inline-flex', 
            padding: '1.2rem', 
            borderRadius: '20px', 
            background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.15), rgba(168, 85, 247, 0.15))',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            marginBottom: '1.5rem',
            boxShadow: '0 0 20px rgba(79, 70, 229, 0.1)'
          }}>
            <UserPlus size={36} color="var(--primary-color)" />
          </div>
          <h2 className="text-gradient" style={{ fontSize: '2rem', margin: '0 0 0.5rem 0' }}>Create Account</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Begin your journey with us</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Input 
            label="Full Name" 
            name="name"
            value={formData.name} 
            onChange={handleChange} 
            placeholder="John Doe"
            required 
          />
          <Input 
            label="Email Address" 
            name="email"
            type="email" 
            value={formData.email} 
            onChange={handleChange} 
            placeholder="john@example.com"
            required 
          />
          <Input 
            label="Password" 
            name="password"
            type="password" 
            value={formData.password} 
            onChange={handleChange} 
            placeholder="••••••••"
            required 
          />
          
          {error && (
            <div style={{ padding: '0.75rem', borderRadius: '8px', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', fontSize: '0.875rem' }}>
              {error}
            </div>
          )}

          <Button type="submit" variant="primary" isLoading={loading} style={{ marginTop: '0.5rem' }}>
            Register Now
          </Button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Already have an account? <Link to="/login" style={{ fontWeight: '600' }}>Sign in here</Link>
        </p>
      </GlassCard>
    </div>
  );
};

export default Register;
