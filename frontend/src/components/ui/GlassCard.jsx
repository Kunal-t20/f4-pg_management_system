import React from 'react';

const GlassCard = ({ children, className = '', title, action }) => {
  return (
    <div className={`glass-panel ${className}`}>
      {(title || action) && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          {title && <h3 style={{ margin: 0, fontSize: '1.25rem' }}>{title}</h3>}
          {action && <div>{action}</div>}
        </div>
      )}
      {children}
    </div>
  );
};

export default GlassCard;
