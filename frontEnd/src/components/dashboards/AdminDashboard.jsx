import React, { useState, useEffect } from 'react';
import { Shield, Users, Briefcase, Film, GraduationCap, Search, Trash2, CheckCircle } from 'lucide-react';
import SkeletonLoader from '../common/SkeletonLoader';

export default function AdminDashboard({ activeTab, setActiveTab, stats, setStats, showToast }) {
  const [allUsers, setAllUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');

  useEffect(() => {
    if (activeTab === 'users') {
      const fetchAllUsers = async () => {
        try {
          const [studentsRes, alumniRes] = await Promise.all([
            fetch('https://6a6c4e39c0679e65f1aa677d-api-capstone.myanatomy.ai/api/dashboard/students', {
              headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            }),
            fetch('https://6a6c4e39c0679e65f1aa677d-api-capstone.myanatomy.ai/api/dashboard/alumni', {
              headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            })
          ]);

          if (studentsRes.ok && alumniRes.ok) {
            const students = await studentsRes.json();
            const alumni = await alumniRes.json();
            
            const formattedStudents = students.map(u => ({ ...u, role: 'STUDENT' }));
            const formattedAlumni = alumni.map(u => ({ ...u, role: 'ALUMNI' }));
            
            setAllUsers([...formattedStudents, ...formattedAlumni]);
          }
        } catch (err) {
          console.error('Error fetching users directory:', err);
        } finally {
          setLoadingUsers(false);
        }
      };

      fetchAllUsers();
    }
  }, [activeTab]);

  const handleDeleteUser = async (userId, userName) => {
    if (window.confirm(`Are you sure you want to delete user "${userName}"?`)) {
      try {
        const response = await fetch(`https://6a6c4e39c0679e65f1aa677d-api-capstone.myanatomy.ai/api/dashboard/users/${userId}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });

        if (response.ok) {
          setAllUsers(prev => prev.filter(u => u.id !== userId));
          if (showToast) showToast(`User ${userName} deleted successfully`, 'info');
        } else {
          if (showToast) showToast('Failed to delete user', 'error');
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  const filteredUsers = allUsers.filter(u => {
    const matchesSearch = u.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.email && u.email.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
    
    return matchesSearch && matchesRole;
  });

  if (activeTab === 'users') {
    return (
      <div>
        <div style={{ marginBottom: '30px' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '6px' }}>Manage Users</h2>
          <p style={{ color: 'var(--text-secondary)' }}>View details, search, and manage account statuses of all students & alumni.</p>
        </div>

        <div className="glass-panel" style={{ padding: '24px', marginBottom: '30px' }}>
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ position: 'relative', width: '300px' }}>
              <Search size={18} style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-muted)'
              }} />
              <input
                type="text"
                placeholder="Search by name, username, email..."
                className="glass-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ paddingLeft: '38px', fontSize: '0.875rem' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              {['ALL', 'STUDENT', 'ALUMNI'].map(role => (
                <button
                  key={role}
                  onClick={() => setRoleFilter(role)}
                  className={roleFilter === role ? 'btn-premium' : 'btn-secondary'}
                  style={{ padding: '8px 16px', fontSize: '0.85rem', borderRadius: '6px' }}
                >
                  {role === 'ALL' ? 'All Roles' : role}
                </button>
              ))}
            </div>
          </div>
        </div>

        {loadingUsers ? (
          <SkeletonLoader count={4} type="list" />
        ) : filteredUsers.length === 0 ? (
          <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
            No users match the criteria.
          </div>
        ) : (
          <div className="glass-panel" style={{ overflowX: 'auto', borderRadius: '16px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-glass)', background: 'rgba(255,255,255,0.02)' }}>
                  <th style={{ padding: '16px 20px', color: 'var(--text-secondary)', fontWeight: 600 }}>Name</th>
                  <th style={{ padding: '16px 20px', color: 'var(--text-secondary)', fontWeight: 600 }}>Username</th>
                  <th style={{ padding: '16px 20px', color: 'var(--text-secondary)', fontWeight: 600 }}>Email</th>
                  <th style={{ padding: '16px 20px', color: 'var(--text-secondary)', fontWeight: 600 }}>Role</th>
                  <th style={{ padding: '16px 20px', color: 'var(--text-secondary)', fontWeight: 600 }}>Details</th>
                  <th style={{ padding: '16px 20px', color: 'var(--text-secondary)', fontWeight: 600, textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map(u => (
                  <tr key={u.id} style={{ borderBottom: '1px solid var(--border-glass)' }}>
                    <td style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <img
                        src={u.profilePicture || `https://api.dicebear.com/7.x/adventurer/svg?seed=${u.username}`}
                        alt={u.fullName}
                        style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', objectFit: 'cover' }}
                      />
                      <span style={{ fontWeight: '600' }}>{u.fullName}</span>
                    </td>
                    <td style={{ padding: '16px 20px', color: 'var(--text-secondary)' }}>@{u.username}</td>
                    <td style={{ padding: '16px 20px', color: 'var(--text-secondary)' }}>{u.email}</td>
                    <td style={{ padding: '16px 20px' }}>
                      <span style={{
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        padding: '3px 8px',
                        borderRadius: '4px',
                        background: u.role === 'ALUMNI' ? 'rgba(139, 92, 246, 0.15)' : 'rgba(59, 130, 246, 0.15)',
                        color: u.role === 'ALUMNI' ? 'var(--accent-purple)' : 'var(--accent-blue)'
                      }}>
                        {u.role}
                      </span>
                    </td>
                    <td style={{ padding: '16px 20px', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                      {u.role === 'ALUMNI' 
                        ? `${u.jobTitle || 'Alumnus'} @ ${u.company || 'Company'}` 
                        : `${u.major || 'Student'} • Class of ${u.graduationYear || '2026'}`}
                    </td>
                    <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                      <button
                        onClick={() => handleDeleteUser(u.id, u.fullName)}
                        style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#ef4444', borderRadius: '6px', padding: '6px 12px', fontSize: '0.8rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                      >
                        <Trash2 size={14} /> Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  }

  // default: 'dashboard'
  return (
    <div>
      <div style={{ marginBottom: '30px' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '6px' }}>
          Admin Control Center <span style={{ color: 'var(--accent-purple)' }}><Shield size={26} style={{ display: 'inline', verticalAlign: 'text-bottom' }} /></span>
        </h2>
        <p style={{ color: 'var(--text-secondary)' }}>Monitor application metrics, review registered users, and moderate community content.</p>
      </div>

      {/* Admin Stats Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px',
        marginBottom: '40px'
      }}>
        <div className="glass-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '10px',
            background: 'rgba(139, 92, 246, 0.15)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            color: 'var(--accent-purple)'
          }}>
            <Users size={24} />
          </div>
          <div>
            <h4 style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 500 }}>Total Users</h4>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800 }}>{stats.totalUsers || 0}</h3>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '10px',
            background: 'rgba(59, 130, 246, 0.15)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            color: 'var(--accent-blue)'
          }}>
            <GraduationCap size={24} />
          </div>
          <div>
            <h4 style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 500 }}>Students</h4>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800 }}>{stats.studentsCount || 0}</h3>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '10px',
            background: 'rgba(217, 70, 239, 0.15)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            color: 'var(--accent-pink)'
          }}>
            <Shield size={24} />
          </div>
          <div>
            <h4 style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 500 }}>Alumni</h4>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800 }}>{stats.alumniCount || 0}</h3>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '10px',
            background: 'rgba(16, 185, 129, 0.15)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            color: '#10b981'
          }}>
            <Briefcase size={24} />
          </div>
          <div>
            <h4 style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 500 }}>Jobs Posted</h4>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800 }}>{stats.totalJobs || 0}</h3>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '10px',
            background: 'rgba(239, 68, 68, 0.15)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            color: '#ef4444'
          }}>
            <Film size={24} />
          </div>
          <div>
            <h4 style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 500 }}>Active Reels</h4>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800 }}>{stats.totalReels || 0}</h3>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '30px' }}>
        {/* Left Side: Recent Users Register Feed */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '20px' }}>Recent Registrations</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {stats.recentUsers && stats.recentUsers.map(user => (
              <div key={user.id} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px 16px',
                background: 'rgba(255,255,255,0.01)',
                border: '1px solid var(--border-glass)',
                borderRadius: '8px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <img
                    src={user.profilePicture || `https://api.dicebear.com/7.x/adventurer/svg?seed=${user.username}`}
                    alt={user.fullName}
                    style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }}
                  />
                  <div>
                    <h5 style={{ fontSize: '0.9rem', fontWeight: 600 }}>{user.fullName}</h5>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{user.email}</span>
                  </div>
                </div>
                <span style={{
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  padding: '2px 6px',
                  borderRadius: '4px',
                  background: user.role === 'ALUMNI' ? 'rgba(139, 92, 246, 0.15)' : 'rgba(59, 130, 246, 0.15)',
                  color: user.role === 'ALUMNI' ? 'var(--accent-purple)' : 'var(--accent-blue)'
                }}>
                  {user.role}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: System Status */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '20px' }}>System Status</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-glass)', paddingBottom: '10px' }}>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Server Status:</span>
              <span style={{ color: '#10b981', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                <CheckCircle size={16} /> ONLINE
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-glass)', paddingBottom: '10px' }}>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Database Type:</span>
              <span style={{ color: 'var(--accent-purple)', fontWeight: 600 }}>MongoDB Cluster</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-glass)', paddingBottom: '10px' }}>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Moderation Filter:</span>
              <span style={{ color: '#10b981', fontWeight: 600 }}>ACTIVE</span>
            </div>
            <div style={{
              background: 'rgba(139, 92, 246, 0.05)',
              border: '1px solid rgba(139, 92, 246, 0.15)',
              borderRadius: '8px',
              padding: '14px',
              fontSize: '0.8rem',
              color: 'var(--text-secondary)',
              lineHeight: '1.5'
            }}>
              💡 <strong>Moderation Note:</strong> As an Administrator, you can delete inappropriate reels directly from the Reels Feed, and manage user accounts from the "Manage Users" tab.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
