import React from 'react';

const Badge = ({ children, variant = 'default', className = '' }) => {
  const styles = {
    padding: '0.25rem 0.75rem',
    borderRadius: '9999px',
    fontSize: '0.75rem',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.3rem',
  };

  const variants = {
    default: { background: 'rgba(148, 163, 184, 0.2)', color: 'var(--text-muted)' },
    success: { background: 'rgba(16, 185, 129, 0.2)', color: 'var(--success)', border: '1px solid rgba(16, 185, 129, 0.3)' },
    warning: { background: 'rgba(245, 158, 11, 0.2)', color: 'var(--warning)', border: '1px solid rgba(245, 158, 11, 0.3)' },
    danger: { background: 'rgba(239, 68, 68, 0.2)', color: 'var(--danger)', border: '1px solid rgba(239, 68, 68, 0.3)' },
    primary: { background: 'rgba(99, 102, 241, 0.2)', color: 'var(--primary-color)', border: '1px solid rgba(99, 102, 241, 0.3)' },
  };

  return (
    <span style={{ ...styles, ...variants[variant] }} className={className}>
      {children}
    </span>
  );
};

export default Badge;
