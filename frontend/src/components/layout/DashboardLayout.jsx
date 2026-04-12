import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LogOut, Home, Users, CreditCard, AlertCircle, LayoutDashboard } from 'lucide-react';
import Button from '../ui/Button';

const DashboardLayout = ({ role, navItems }) => {
  const { user, logout } = useAuth();

  return (
    <div className="app-container">
      {/* Sidebar */}
      <aside style={{
        width: '260px',
        background: 'rgba(15, 23, 42, 0.4)',
        backdropFilter: 'blur(10px)',
        borderRight: '1px solid var(--glass-border)',
        padding: '2rem 1.5rem',
        display: 'flex',
        flexDirection: 'column',
      }}>
        <div style={{ marginBottom: '3rem', paddingLeft: '0.5rem' }}>
          <h2 style={{ fontSize: '1.25rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--primary-color)' }}>
            <LayoutDashboard size={24} />
            PG Admin
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
            {role === 'admin' ? 'Administrator' : 'Student'} Profile
          </p>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.exact}
              className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '0.85rem 1rem',
                borderRadius: '8px',
                color: 'var(--text-muted)',
                fontWeight: '500',
                transition: 'all 0.2s',
                textDecoration: 'none'
              }}
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div style={{ marginTop: 'auto', paddingTop: '2rem', borderTop: '1px solid var(--glass-border)' }}>
          <div style={{ padding: '0 1rem', marginBottom: '1.5rem' }}>
            <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>{user?.email}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Role: {user?.role}</div>
          </div>
          <Button 
            onClick={logout}
            variant="danger"
            style={{ width: '100%' }}
          >
            <LogOut size={18} />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="main-content">
        <Outlet />
      </main>

      <style>{`
        .nav-item:hover {
          background: rgba(255, 255, 255, 0.05);
          color: var(--text-main) !important;
        }
        .nav-item.active {
          background: linear-gradient(90deg, rgba(99, 102, 241, 0.2), transparent);
          color: var(--primary-color) !important;
          border-left: 3px solid var(--primary-color);
        }
        .logout-btn:hover {
          background: rgba(239, 68, 68, 0.2) !important;
        }
      `}</style>
    </div>
  );
};

export default DashboardLayout;
