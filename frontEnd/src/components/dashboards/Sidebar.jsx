import React from 'react';
import { LayoutDashboard, Film, Briefcase, PlusSquare, Users, Image, Calendar, User, LogOut } from 'lucide-react';

export default function Sidebar({ user, activeTab, setActiveTab, onLogout }) {
  const getNavItems = () => {
    const baseItems = [
      { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
      { id: 'reels', label: 'Alumni Reels', icon: <Film size={20} /> },
      { id: 'events', label: 'Events & Webinars', icon: <Calendar size={20} /> },
      { id: 'photos', label: 'Photo Gallery', icon: <Image size={20} /> },
      { id: 'jobs', label: 'Opportunity Board', icon: <Briefcase size={20} /> },
    ];

    if (user.role === 'ALUMNI') {
      return [
        ...baseItems,
        { id: 'post-job', label: 'Post a Job', icon: <PlusSquare size={20} /> },
        { id: 'post-reel', label: 'Upload Reel', icon: <Film size={20} /> },
      ];
    }

    if (user.role === 'ADMIN') {
      return [
        ...baseItems,
        { id: 'users', label: 'Manage Users', icon: <Users size={20} /> },
      ];
    }

    return baseItems;
  };

  const navItems = getNavItems();

  return (
    <div className="glass-panel" style={{
      width: '260px',
      height: 'calc(100vh - 40px)',
      position: 'fixed',
      top: '20px',
      left: '20px',
      display: 'flex',
      flexDirection: 'column',
      padding: '24px 16px',
      zIndex: 100,
      border: '1px solid var(--border-glass)',
      borderRadius: '20px'
    }}>
      {/* Brand Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '30px',
        paddingLeft: '8px'
      }}>
        <div style={{
          width: '36px',
          height: '36px',
          borderRadius: '10px',
          background: 'var(--gradient-accent)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          fontWeight: 'bold',
          fontSize: '1.2rem',
          color: '#ffffff'
        }}>
          H
        </div>
        <div>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 800, letterSpacing: '-0.5px' }}>Alumni Hive</h2>
          <span style={{ fontSize: '0.7rem', color: 'var(--accent-purple)', fontWeight: 600 }}>{user.role} PANEL</span>
        </div>
      </div>

      {/* User Profile Info Card */}
      <div 
        onClick={() => setActiveTab('profile')}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          background: activeTab === 'profile' ? 'rgba(139, 92, 246, 0.15)' : 'rgba(255, 255, 255, 0.03)',
          border: '1px solid',
          borderColor: activeTab === 'profile' ? 'var(--accent-purple)' : 'var(--border-glass)',
          padding: '12px',
          borderRadius: '12px',
          marginBottom: '24px',
          cursor: 'pointer',
          transition: 'all 0.2s ease'
        }}
      >
        <img
          src={user.profilePicture || `https://api.dicebear.com/7.x/adventurer/svg?seed=${user.username}`}
          alt={user.fullName}
          style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', objectFit: 'cover' }}
        />
        <div style={{ overflow: 'hidden', flex: 1 }}>
          <h4 style={{ fontSize: '0.875rem', fontWeight: '600', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {user.fullName}
          </h4>
          <p style={{ fontSize: '0.725rem', color: 'var(--text-secondary)' }}>@{user.username}</p>
        </div>
        <User size={16} style={{ color: activeTab === 'profile' ? 'var(--accent-purple)' : 'var(--text-muted)' }} />
      </div>

      {/* Navigation Tabs */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1, overflowY: 'auto' }}>
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                width: '100%',
                padding: '10px 14px',
                background: isActive ? 'var(--gradient-accent)' : 'transparent',
                border: 'none',
                borderRadius: '10px',
                color: isActive ? '#ffffff' : 'var(--text-secondary)',
                fontFamily: 'var(--font-title)',
                fontWeight: isActive ? 600 : 500,
                fontSize: '0.9rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                textAlign: 'left'
              }}
            >
              <span style={{ color: isActive ? '#ffffff' : 'var(--text-muted)' }}>
                {item.icon}
              </span>
              {item.label}
            </button>
          );
        })}
      </div>

      {/* Logout Button */}
      <button
        onClick={onLogout}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          width: '100%',
          padding: '12px 14px',
          background: 'rgba(239, 68, 68, 0.08)',
          border: '1px solid rgba(239, 68, 68, 0.2)',
          borderRadius: '10px',
          color: '#ef4444',
          fontFamily: 'var(--font-title)',
          fontWeight: 600,
          fontSize: '0.9rem',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          marginTop: 'auto'
        }}
      >
        <LogOut size={18} />
        Log Out
      </button>
    </div>
  );
}
