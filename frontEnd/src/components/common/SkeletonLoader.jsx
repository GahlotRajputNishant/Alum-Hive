import React from 'react';

export default function SkeletonLoader({ type = 'card', count = 3 }) {
  if (type === 'card') {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px', width: '100%' }}>
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
              <div className="skeleton" style={{ width: '50px', height: '50px', borderRadius: '12px', flexShrink: 0 }} />
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div className="skeleton" style={{ height: '16px', width: '70%' }} />
                <div className="skeleton" style={{ height: '12px', width: '45%' }} />
              </div>
            </div>
            <div className="skeleton" style={{ height: '12px', width: '100%' }} />
            <div className="skeleton" style={{ height: '12px', width: '85%' }} />
            <div className="skeleton" style={{ height: '36px', width: '100%', borderRadius: '8px', marginTop: '6px' }} />
          </div>
        ))}
      </div>
    );
  }

  if (type === 'stat') {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', width: '100%' }}>
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="glass-panel" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div className="skeleton" style={{ width: '48px', height: '48px', borderRadius: '12px' }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
              <div className="skeleton" style={{ height: '12px', width: '60%' }} />
              <div className="skeleton" style={{ height: '24px', width: '40%' }} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="skeleton" style={{ height: '40px', width: '100%', borderRadius: '8px' }} />
      ))}
    </div>
  );
}
