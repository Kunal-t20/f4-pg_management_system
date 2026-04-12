import React, { useState } from 'react';

const Input = React.forwardRef(({ label, error, className = '', ...props }, ref) => {
  const [focused, setFocused] = useState(false);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem', position: 'relative' }} className={className}>
      {label && (
        <label style={{ 
          fontSize: '0.9rem', 
          color: focused ? 'var(--primary-color)' : 'var(--text-muted)', 
          fontWeight: '500',
          transition: 'color 0.3s ease',
          fontFamily: "'Outfit', sans-serif"
        }}>
          {label}
        </label>
      )}
      <input
        ref={ref}
        className="ui-input"
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        {...props}
      />
      {error && <span style={{ color: 'var(--danger)', fontSize: '0.8rem', marginTop: '-0.25rem' }}>{error}</span>}
      
      <style>{`
        .ui-input {
          width: 100%;
          padding: 0.85rem 1.2rem;
          background: rgba(15, 23, 42, 0.4);
          backdrop-filter: blur(8px);
          border: 1px solid var(--glass-border);
          border-radius: 12px;
          color: var(--text-main);
          font-family: 'Inter', sans-serif;
          font-size: 1rem;
          transition: var(--transition-smooth);
        }
        .ui-input:hover {
          border-color: rgba(255, 255, 255, 0.2);
          background: rgba(15, 23, 42, 0.6);
        }
        .ui-input:focus {
          outline: none;
          background: rgba(15, 23, 42, 0.8);
          border-color: var(--primary-color);
          box-shadow: 0 0 0 4px rgba(79, 70, 229, 0.15), inset 0 0 0 1px var(--primary-color);
        }
        .ui-input::placeholder {
          color: rgba(148, 163, 184, 0.4);
        }
      `}</style>
    </div>
  );
});

export default Input;
