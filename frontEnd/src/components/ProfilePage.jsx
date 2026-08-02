import React, { useState } from 'react';
import { User, Save, Upload, Link, Camera } from 'lucide-react';

export default function ProfilePage({ user, onProfileUpdated, showToast }) {
  const [fullName, setFullName] = useState(user.fullName || '');
  const [bio, setBio] = useState(user.bio || '');
  const [major, setMajor] = useState(user.major || '');
  const [graduationYear, setGraduationYear] = useState(user.graduationYear || '');
  const [company, setCompany] = useState(user.company || '');
  const [jobTitle, setJobTitle] = useState(user.jobTitle || '');
  const [profilePicture, setProfilePicture] = useState(user.profilePicture || '');
  const [uploadMode, setUploadMode] = useState('file'); // 'file' or 'url'
  const [saving, setSaving] = useState(false);

  const handleAvatarFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicture(reader.result); // Data URL Base64
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const response = await fetch('https://6a6c4e39c0679e65f1aa677d-api-capstone.myanatomy.ai/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          fullName,
          bio,
          major,
          graduationYear: graduationYear ? parseInt(graduationYear) : null,
          company,
          jobTitle,
          profilePicture
        })
      });

      if (response.ok) {
        const updated = await response.json();
        const savedUser = JSON.parse(localStorage.getItem('user') || '{}');
        savedUser.fullName = updated.fullName;
        savedUser.profilePicture = updated.profilePicture;
        localStorage.setItem('user', JSON.stringify(savedUser));

        if (onProfileUpdated) onProfileUpdated(updated);
        if (showToast) showToast('Profile updated successfully!', 'success');
      } else {
        if (showToast) showToast('Failed to update profile', 'error');
      }
    } catch (err) {
      console.error(err);
      if (showToast) showToast('Error saving profile changes', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ maxWidth: '680px', margin: '0 auto' }}>
      <div style={{ marginBottom: '30px' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '6px' }}>My Account Profile</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Manage your profile photo, headline, role parameters, and bio.</p>
      </div>

      <div className="glass-panel-dark" style={{ padding: '32px', boxShadow: 'var(--shadow-premium)' }}>
        {/* Avatar Display & Direct Upload */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '30px', borderBottom: '1px solid var(--border-glass)', paddingBottom: '24px' }}>
          <div style={{ position: 'relative' }}>
            <img
              src={profilePicture || `https://api.dicebear.com/7.x/adventurer/svg?seed=${user.username}`}
              alt={fullName}
              style={{ width: '90px', height: '90px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', border: '3px solid var(--accent-purple)', objectFit: 'cover' }}
            />
          </div>

          <div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 700 }}>{fullName || user.fullName}</h3>
            <span style={{
              fontSize: '0.75rem',
              fontWeight: 700,
              padding: '2px 8px',
              borderRadius: '4px',
              background: 'rgba(139, 92, 246, 0.2)',
              color: 'var(--accent-purple)',
              display: 'inline-block',
              marginTop: '4px'
            }}>
              {user.role} ROLE
            </span>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>@{user.username}</p>
          </div>
        </div>

        {/* Profile Picture Source Selector */}
        <div style={{ marginBottom: '24px', background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-glass)' }}>
          <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '10px', fontWeight: 600 }}>Change Profile Photo</label>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '14px' }}>
            <button
              type="button"
              onClick={() => setUploadMode('file')}
              style={{
                flex: 1,
                padding: '8px',
                borderRadius: '6px',
                border: 'none',
                background: uploadMode === 'file' ? 'var(--gradient-accent)' : 'rgba(255,255,255,0.05)',
                color: uploadMode === 'file' ? '#ffffff' : 'var(--text-secondary)',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}
            >
              <Upload size={14} /> From Device
            </button>
            <button
              type="button"
              onClick={() => setUploadMode('url')}
              style={{
                flex: 1,
                padding: '8px',
                borderRadius: '6px',
                border: 'none',
                background: uploadMode === 'url' ? 'var(--gradient-accent)' : 'rgba(255,255,255,0.05)',
                color: uploadMode === 'url' ? '#ffffff' : 'var(--text-secondary)',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}
            >
              <Link size={14} /> Image URL / Drive
            </button>
          </div>

          {uploadMode === 'file' ? (
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarFileChange}
              className="glass-input"
              style={{ padding: '8px', fontSize: '0.85rem' }}
            />
          ) : (
            <input
              type="url"
              className="glass-input"
              placeholder="https://api.dicebear.com/... or https://drive.google.com/..."
              value={profilePicture}
              onChange={(e) => setProfilePicture(e.target.value)}
              style={{ fontSize: '0.85rem' }}
            />
          )}
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '8px', fontWeight: 500 }}>Full Name</label>
            <input
              type="text"
              className="glass-input"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '8px', fontWeight: 500 }}>Bio / Professional Headline</label>
            <textarea
              className="glass-input"
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell the community about your background, interests..."
              style={{ resize: 'vertical' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '8px', fontWeight: 500 }}>Field of Study / Major</label>
              <input
                type="text"
                className="glass-input"
                value={major}
                onChange={(e) => setMajor(e.target.value)}
                placeholder="e.g. Computer Science"
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '8px', fontWeight: 500 }}>Graduation Year</label>
              <input
                type="number"
                className="glass-input"
                value={graduationYear}
                onChange={(e) => setGraduationYear(e.target.value)}
                placeholder="e.g. 2026"
              />
            </div>
          </div>

          {user.role === 'ALUMNI' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '8px', fontWeight: 500 }}>Current Company</label>
                <input
                  type="text"
                  className="glass-input"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="e.g. Google"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '8px', fontWeight: 500 }}>Job Title</label>
                <input
                  type="text"
                  className="glass-input"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  placeholder="e.g. Senior Software Engineer"
                />
              </div>
            </div>
          )}

          <button type="submit" className="btn-premium" style={{ marginTop: '10px', width: '100%' }} disabled={saving}>
            <Save size={18} /> {saving ? 'Saving...' : 'Save Profile Changes'}
          </button>
        </form>
      </div>
    </div>
  );
}
