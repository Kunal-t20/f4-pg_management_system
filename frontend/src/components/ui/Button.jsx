import React from 'react';

const Button = ({ children, variant = 'primary', className = '', isLoading, style, ...props }) => {
  const baseStyle = {
    padding: '0.75rem 1.75rem',
    borderRadius: '12px', /* more rounded */
    border: 'none',
    fontWeight: '600',
    fontFamily: "'Outfit', sans-serif",
    letterSpacing: '0.02em',
    cursor: 'pointer',
    position: 'relative',
    overflow: 'hidden',
    transition: 'var(--transition-smooth)',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.6rem',
    ...style
  };

  const variants = {
    primary: {
      background: 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))',
      color: '#fff',
      boxShadow: '0 4px 15px var(--primary-glow)',
    },
    secondary: {
      background: 'rgba(255, 255, 255, 0.05)',
      color: '#fff',
      border: '1px solid var(--glass-border)',
      backdropFilter: 'blur(10px)',
    },
    danger: {
      background: 'linear-gradient(135deg, var(--danger), #be123c)',
      color: '#fff',
      boxShadow: '0 4px 15px rgba(239, 68, 68, 0.4)',
    }
  };

  const currentStyle = { ...baseStyle, ...variants[variant] };

  return (
    <button style={currentStyle} className={`${className} ui-btn ${variant}-btn`} disabled={isLoading} {...props}>
      {isLoading ? (
        <span style={{ 
          width: '18px', height: '18px', 
          border: '2px solid rgba(255,255,255,0.3)', 
          borderTop: '2px solid #fff', 
          borderRadius: '50%', 
          animation: 'spin 1s linear infinite' 
        }}></span>
      ) : null}
      <span style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>{children}</span>
      <style>{`
        .ui-btn {
          transform-origin: center;
        }
        .ui-btn::before {
          content: "";
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.2), rgba(255,255,255,0));
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        .ui-btn:hover:not(:disabled) {
          transform: translateY(-2px) scale(1.02);
        }
        .primary-btn:hover:not(:disabled) {
          box-shadow: 0 8px 25px var(--primary-glow);
        }
        .secondary-btn:hover:not(:disabled) {
          background: rgba(255, 255, 255, 0.1);
          border-color: rgba(255, 255, 255, 0.3);
        }
        .ui-btn:hover::before {
          opacity: 1;
        }
        .ui-btn:active:not(:disabled) {
          transform: translateY(1px) scale(0.98);
        }
        .ui-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </button>
  );
};

export default Button;
