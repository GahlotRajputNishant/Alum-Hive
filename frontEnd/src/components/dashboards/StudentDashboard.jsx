import React, { useState, useEffect } from 'react';
import { Users, Briefcase, Film, Award, Send, Search, UserCheck, UserPlus, Bell, Calendar } from 'lucide-react';
import SkeletonLoader from '../common/SkeletonLoader';

export default function StudentDashboard({ stats, setStats, showToast }) {
  const [alumni, setAlumni] = useState([]);
  const [loadingAlumni, setLoadingAlumni] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [inquiries, setInquiries] = useState({});
  const [followingMap, setFollowingMap] = useState({});

  const fetchAlumni = async () => {
    try {
      const response = await fetch('https://6a6c4e39c0679e65f1aa677d-api-capstone.myanatomy.ai/api/dashboard/alumni', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setAlumni(data);

        // Map initial follow status
        const initialMap = {};
        data.forEach(a => {
          if (a.isFollowing) initialMap[a.id] = true;
        });
        setFollowingMap(initialMap);
      }
    } catch (err) {
      console.error('Error fetching alumni:', err);
    } finally {
      setLoadingAlumni(false);
    }
  };

  useEffect(() => {
    fetchAlumni();
  }, []);

  const toggleFollow = async (alumniId, name) => {
    const isCurrentlyFollowing = followingMap[alumniId];
    const method = isCurrentlyFollowing ? 'DELETE' : 'POST';

    try {
      const response = await fetch(`https://6a6c4e39c0679e65f1aa677d-api-capstone.myanatomy.ai/api/follow/${alumniId}`, {
        method,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        setFollowingMap(prev => ({
          ...prev,
          [alumniId]: !isCurrentlyFollowing
        }));

        if (showToast) {
          showToast(!isCurrentlyFollowing ? `Following ${name}` : `Unfollowed ${name}`, 'info');
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const sendMentorshipInquiry = (alumniId, name) => {
    setInquiries(prev => ({ ...prev, [alumniId]: 'sending' }));
    setTimeout(() => {
      setInquiries(prev => ({ ...prev, [alumniId]: 'sent' }));
      if (showToast) showToast(`Mentorship request sent to ${name}!`, 'success');
    }, 1200);
  };

  const filteredAlumni = alumni.filter(a => 
    a.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (a.company && a.company.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (a.jobTitle && a.jobTitle.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (a.major && a.major.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div>
      <div style={{ marginBottom: '30px' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '6px' }}>
          Welcome back, <span style={{ background: 'var(--gradient-accent)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{stats.fullName || 'Student'}</span>! 👋
        </h2>
        <p style={{ color: 'var(--text-secondary)' }}>Explore your student portal. Follow alumni mentors, request guidance, and stay updated on tech internships.</p>
      </div>

      {/* Stats Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '20px',
        marginBottom: '40px'
      }}>
        <div className="glass-card" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{
            width: '54px',
            height: '54px',
            borderRadius: '12px',
            background: 'rgba(59, 130, 246, 0.15)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            color: 'var(--accent-blue)'
          }}>
            <Users size={28} />
          </div>
          <div>
            <h4 style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 500 }}>Alumni Mentors</h4>
            <h3 style={{ fontSize: '1.8rem', fontWeight: 800 }}>{stats.alumniCount || 0}</h3>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{
            width: '54px',
            height: '54px',
            borderRadius: '12px',
            background: 'rgba(139, 92, 246, 0.15)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            color: 'var(--accent-purple)'
          }}>
            <UserCheck size={28} />
          </div>
          <div>
            <h4 style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 500 }}>Mentors Following</h4>
            <h3 style={{ fontSize: '1.8rem', fontWeight: 800 }}>{Object.values(followingMap).filter(Boolean).length}</h3>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{
            width: '54px',
            height: '54px',
            borderRadius: '12px',
            background: 'rgba(16, 185, 129, 0.15)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            color: '#10b981'
          }}>
            <Briefcase size={28} />
          </div>
          <div>
            <h4 style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 500 }}>Active Jobs</h4>
            <h3 style={{ fontSize: '1.8rem', fontWeight: 800 }}>{stats.totalJobs || 0}</h3>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{
            width: '54px',
            height: '54px',
            borderRadius: '12px',
            background: 'rgba(217, 70, 239, 0.15)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            color: 'var(--accent-pink)'
          }}>
            <Film size={28} />
          </div>
          <div>
            <h4 style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 500 }}>Tech Reels</h4>
            <h3 style={{ fontSize: '1.8rem', fontWeight: 800 }}>{stats.totalReels || 0}</h3>
          </div>
        </div>
      </div>

      {/* Alumni Mentors Directory section */}
      <div style={{ marginBottom: '40px' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '20px'
        }}>
          <div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Alumni Mentor Directory</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Follow mentors to get direct updates on company referrals and internships.</p>
          </div>
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
              placeholder="Search by name, company, role..."
              className="glass-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ paddingLeft: '38px', fontSize: '0.875rem' }}
            />
          </div>
        </div>

        {loadingAlumni ? (
          <SkeletonLoader count={3} type="card" />
        ) : filteredAlumni.length === 0 ? (
          <div className="glass-panel" style={{ padding: '30px', textAlign: 'center', color: 'var(--text-secondary)' }}>
            No alumni mentors found matching "{searchQuery}".
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '20px'
          }}>
            {filteredAlumni.map((alumnus) => {
              const isFollowing = followingMap[alumnus.id];
              return (
                <div key={alumnus.id} className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', height: '100%' }}>
                  <div style={{ display: 'flex', gap: '14px', marginBottom: '16px' }}>
                    <img
                      src={alumnus.profilePicture || `https://api.dicebear.com/7.x/adventurer/svg?seed=${alumnus.username}`}
                      alt={alumnus.fullName}
                      style={{
                        width: '60px',
                        height: '60px',
                        borderRadius: '14px',
                        background: 'rgba(255,255,255,0.05)',
                        objectFit: 'cover',
                        border: '1px solid var(--border-glass)'
                      }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <h4 style={{ fontSize: '1.05rem', fontWeight: '700' }}>{alumnus.fullName}</h4>
                        <button
                          onClick={() => toggleFollow(alumnus.id, alumnus.fullName)}
                          style={{
                            background: isFollowing ? 'rgba(16, 185, 129, 0.15)' : 'rgba(139, 92, 246, 0.15)',
                            border: `1px solid ${isFollowing ? '#10b981' : 'var(--accent-purple)'}`,
                            color: isFollowing ? '#10b981' : 'var(--accent-purple)',
                            borderRadius: '6px',
                            padding: '4px 10px',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          {isFollowing ? <UserCheck size={14} /> : <UserPlus size={14} />}
                          {isFollowing ? 'Following' : 'Follow'}
                        </button>
                      </div>
                      <p style={{ fontSize: '0.85rem', color: 'var(--accent-purple)', fontWeight: 600, marginTop: '2px' }}>
                        {alumnus.jobTitle} {alumnus.company ? `@ ${alumnus.company}` : ''}
                      </p>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        Class of {alumnus.graduationYear} • {alumnus.major}
                      </p>
                    </div>
                  </div>

                  <p style={{
                    fontSize: '0.875rem',
                    color: 'var(--text-secondary)',
                    marginBottom: '20px',
                    flex: 1,
                    lineHeight: '1.5'
                  }}>
                    {alumnus.bio || "No bio added yet."}
                  </p>

                  <button
                    onClick={() => sendMentorshipInquiry(alumnus.id, alumnus.fullName)}
                    className="btn-premium"
                    style={{
                      width: '100%',
                      padding: '10px 16px',
                      fontSize: '0.875rem',
                      background: inquiries[alumnus.id] === 'sent' 
                        ? 'rgba(16, 185, 129, 0.2)' 
                        : inquiries[alumnus.id] === 'sending' 
                          ? 'rgba(255, 255, 255, 0.05)'
                          : 'var(--gradient-accent)',
                      border: inquiries[alumnus.id] === 'sent' ? '1px solid #10b981' : 'none',
                      color: inquiries[alumnus.id] === 'sent' ? '#10b981' : '#ffffff',
                      cursor: inquiries[alumnus.id] === 'sending' || inquiries[alumnus.id] === 'sent' ? 'default' : 'pointer'
                    }}
                    disabled={inquiries[alumnus.id] === 'sending' || inquiries[alumnus.id] === 'sent'}
                  >
                    {inquiries[alumnus.id] === 'sending' ? (
                      'Sending Request...'
                    ) : inquiries[alumnus.id] === 'sent' ? (
                      'Inquiry Sent! Check Email'
                    ) : (
                      <>
                        <Send size={16} /> Connect for Mentorship
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
