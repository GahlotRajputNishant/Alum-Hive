import React, { useState } from 'react';
import { User, Lock, Mail, GraduationCap, Briefcase, ArrowLeft } from 'lucide-react';

export default function Register({ onRegisterSuccess, switchToLogin, onBackToHome }) {
  const [role, setRole] = useState('STUDENT'); // STUDENT, ALUMNI
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [bio, setBio] = useState('');
  
  // Conditional fields
  const [major, setMajor] = useState('');
  const [graduationYear, setGraduationYear] = useState('');
  const [company, setCompany] = useState('');
  const [jobTitle, setJobTitle] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!username || !password || !email || !fullName) {
      setError('Please fill in all mandatory fields.');
      return;
    }
    setError('');
    setLoading(true);

    const payload = {
      username,
      password,
      email,
      role,
      fullName,
      bio,
      major,
      graduationYear: graduationYear ? parseInt(graduationYear) : null,
      company: role === 'ALUMNI' ? company : null,
      jobTitle: role === 'ALUMNI' ? jobTitle : null,
    };

    try {
      const response = await fetch('https://6a6c4e39c0679e65f1aa677d-api-capstone.myanatomy.ai/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Registration failed.');
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify({
        userId: data.userId,
        username: data.username,
        role: data.role,
        fullName: data.fullName
      }));

      onRegisterSuccess(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      width: '100vw',
      position: 'relative',
      overflow: 'hidden',
      padding: '40px 20px',
      background: 'var(--bg-primary)'
    }}>
      <div className="glow-spot glow-spot-1"></div>
      <div className="glow-spot glow-spot-2"></div>

      {onBackToHome && (
        <button
          onClick={onBackToHome}
          className="btn-secondary"
          style={{
            position: 'absolute',
            top: '24px',
            left: '24px',
            zIndex: 10,
            padding: '8px 16px',
            fontSize: '0.85rem'
          }}
        >
          <ArrowLeft size={16} /> Back to Home
        </button>
      )}

      <div className="glass-panel-dark" style={{
        width: '100%',
        maxWidth: '560px',
        padding: '40px 30px',
        boxShadow: 'var(--shadow-premium)',
        position: 'relative',
        zIndex: 1
      }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h1 style={{
            fontSize: '2.2rem',
            background: 'var(--gradient-accent)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: '800',
            letterSpacing: '-0.5px',
            marginBottom: '8px'
          }}>Join the Hive</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Choose your role and start networking with the community.
          </p>
        </div>

        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            color: '#ef4444',
            padding: '12px',
            borderRadius: '8px',
            fontSize: '0.875rem',
            marginBottom: '20px',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        {/* Custom Role Selector Cards (Student & Alumni Only) */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{
            display: 'block',
            fontSize: '0.85rem',
            color: 'var(--text-secondary)',
            marginBottom: '10px',
            fontWeight: 500
          }}>Select your registration role</label>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '16px'
          }}>
            <div
              onClick={() => setRole('STUDENT')}
              className="glass-card"
              style={{
                padding: '18px',
                textAlign: 'center',
                cursor: 'pointer',
                borderColor: role === 'STUDENT' ? 'var(--accent-purple)' : 'var(--border-glass)',
                boxShadow: role === 'STUDENT' ? '0 0 16px rgba(139, 92, 246, 0.25)' : 'none',
                background: role === 'STUDENT' ? 'rgba(139, 92, 246, 0.15)' : 'var(--gradient-card)'
              }}
            >
              <GraduationCap size={28} style={{ color: role === 'STUDENT' ? 'var(--accent-purple)' : 'var(--text-secondary)', marginBottom: '8px' }} />
              <div style={{ fontSize: '0.95rem', fontWeight: '700', color: role === 'STUDENT' ? '#ffffff' : 'var(--text-secondary)' }}>Student</div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginTop: '2px' }}>Seeking Mentorship & Jobs</span>
            </div>

            <div
              onClick={() => setRole('ALUMNI')}
              className="glass-card"
              style={{
                padding: '18px',
                textAlign: 'center',
                cursor: 'pointer',
                borderColor: role === 'ALUMNI' ? 'var(--accent-purple)' : 'var(--border-glass)',
                boxShadow: role === 'ALUMNI' ? '0 0 16px rgba(139, 92, 246, 0.25)' : 'none',
                background: role === 'ALUMNI' ? 'rgba(139, 92, 246, 0.15)' : 'var(--gradient-card)'
              }}
            >
              <Briefcase size={28} style={{ color: role === 'ALUMNI' ? 'var(--accent-purple)' : 'var(--text-secondary)', marginBottom: '8px' }} />
              <div style={{ fontSize: '0.95rem', fontWeight: '700', color: role === 'ALUMNI' ? '#ffffff' : 'var(--text-secondary)' }}>Alumni</div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginTop: '2px' }}>Post Roles & Share Experience</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>Username *</label>
              <div style={{ position: 'relative' }}>
                <User size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  className="glass-input"
                  placeholder="johndoe"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  style={{ paddingLeft: '38px', fontSize: '0.9rem' }}
                  disabled={loading}
                  required
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>Password *</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="password"
                  className="glass-input"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ paddingLeft: '38px', fontSize: '0.9rem' }}
                  disabled={loading}
                  required
                />
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>Full Name *</label>
              <input
                type="text"
                className="glass-input"
                placeholder="John Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                style={{ fontSize: '0.9rem' }}
                disabled={loading}
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>Email Address *</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="email"
                  className="glass-input"
                  placeholder="john@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ paddingLeft: '38px', fontSize: '0.9rem' }}
                  disabled={loading}
                  required
                />
              </div>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>Bio / Headline</label>
            <textarea
              className="glass-input"
              placeholder="Tell us about yourself..."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              style={{ minHeight: '60px', resize: 'vertical', fontSize: '0.9rem' }}
              disabled={loading}
            />
          </div>

          <div style={{
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid var(--border-glass)',
            borderRadius: '12px',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            <div style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--accent-purple)', marginBottom: '4px' }}>
              {role === 'STUDENT' ? 'Student Details' : 'Alumni Professional Details'}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>Field of Study / Major</label>
                <input
                  type="text"
                  className="glass-input"
                  placeholder="e.g. Computer Science"
                  value={major}
                  onChange={(e) => setMajor(e.target.value)}
                  style={{ fontSize: '0.85rem', padding: '10px' }}
                  disabled={loading}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>Graduation Year</label>
                <input
                  type="number"
                  className="glass-input"
                  placeholder="e.g. 2026"
                  value={graduationYear}
                  onChange={(e) => setGraduationYear(e.target.value)}
                  style={{ fontSize: '0.85rem', padding: '10px' }}
                  disabled={loading}
                />
              </div>
            </div>

            {role === 'ALUMNI' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>Company</label>
                  <input
                    type="text"
                    className="glass-input"
                    placeholder="e.g. Google"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    style={{ fontSize: '0.85rem', padding: '10px' }}
                    disabled={loading}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>Job Title</label>
                  <input
                    type="text"
                    className="glass-input"
                    placeholder="e.g. Software Engineer"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    style={{ fontSize: '0.85rem', padding: '10px' }}
                    disabled={loading}
                  />
                </div>
              </div>
            )}
          </div>

          <button type="submit" className="btn-premium" style={{ width: '100%', marginTop: '10px' }} disabled={loading}>
            {loading ? 'Creating Account...' : 'Complete Registration'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            Already have an account?{' '}
            <button
              onClick={switchToLogin}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--accent-purple)',
                cursor: 'pointer',
                fontWeight: '600',
                textDecoration: 'underline',
                padding: '0'
              }}
            >
              Sign In
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
