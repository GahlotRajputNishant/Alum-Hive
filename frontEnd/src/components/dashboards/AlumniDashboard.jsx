import React, { useState, useEffect } from 'react';
import { Briefcase, Users, Film, PlusSquare, Check, X, Info, UserCheck, Upload, Link } from 'lucide-react';
import SkeletonLoader from '../common/SkeletonLoader';

export default function AlumniDashboard({ activeTab, setActiveTab, stats, setStats, showToast }) {
  // Post a Job Form State
  const [jobTitle, setJobTitle] = useState('');
  const [jobCompany, setJobCompany] = useState('');
  const [jobLocation, setJobLocation] = useState('');
  const [jobSalary, setJobSalary] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [jobLoading, setJobLoading] = useState(false);

  // Upload Reel Form State
  const [reelUploadMode, setReelUploadMode] = useState('file'); // 'file' or 'url'
  const [videoUrl, setVideoUrl] = useState('');
  const [reelCaption, setReelCaption] = useState('');
  const [reelLoading, setReelLoading] = useState(false);

  // Students list state
  const [students, setStudents] = useState([]);
  const [loadingStudents, setLoadingStudents] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Mentorship Requests State
  const [mentorshipRequests, setMentorshipRequests] = useState([
    { id: '101', studentName: 'Aarav Sharma', major: 'Computer Science', year: 2027, message: 'Hi! I noticed you work as a Senior Software Engineer at Google. I would love some tips on getting tech internships.', status: 'pending' },
    { id: '102', studentName: 'Priya Sen', major: 'Information Technology', year: 2026, message: 'Hello, I am interested in AI research & data pipelines. Do you have any suggestions for core tech roles?', status: 'pending' }
  ]);

  useEffect(() => {
    if (activeTab === 'dashboard') {
      const fetchStudents = async () => {
        try {
          const response = await fetch('https://6a6c4e39c0679e65f1aa677d-api-capstone.myanatomy.ai/api/dashboard/students', {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          });
          if (response.ok) {
            const data = await response.json();
            setStudents(data);
          }
        } catch (err) {
          console.error('Error fetching students:', err);
        } finally {
          setLoadingStudents(false);
        }
      };
      fetchStudents();
    }
  }, [activeTab]);

  const handleVideoFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setVideoUrl(reader.result); // Data URL Base64
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePostJob = async (e) => {
    e.preventDefault();
    if (!jobTitle || !jobCompany || !jobDescription) {
      if (showToast) showToast('Please fill in Title, Company, and Description', 'error');
      return;
    }
    setJobLoading(true);

    try {
      const response = await fetch('https://6a6c4e39c0679e65f1aa677d-api-capstone.myanatomy.ai/api/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          title: jobTitle,
          company: jobCompany,
          location: jobLocation,
          description: jobDescription,
          salaryRange: jobSalary
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to post job');
      }

      if (showToast) showToast('Job opportunity posted successfully!', 'success');
      setJobTitle('');
      setJobCompany('');
      setJobLocation('');
      setJobSalary('');
      setJobDescription('');

      if (stats && setStats) {
        setStats(prev => ({
          ...prev,
          jobsPostedCount: (prev.jobsPostedCount || 0) + 1
        }));
      }
    } catch (err) {
      if (showToast) showToast(err.message, 'error');
    } finally {
      setJobLoading(false);
    }
  };

  const handleUploadReel = async (e) => {
    e.preventDefault();
    if (!videoUrl) {
      if (showToast) showToast('Video file or URL is required', 'error');
      return;
    }
    setReelLoading(true);

    try {
      const response = await fetch('https://6a6c4e39c0679e65f1aa677d-api-capstone.myanatomy.ai/api/reels', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          videoUrl,
          caption: reelCaption
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to upload reel');
      }

      if (showToast) showToast('Reel posted successfully! It is now live in the Reels Feed.', 'success');
      setVideoUrl('');
      setReelCaption('');

      if (stats && setStats) {
        setStats(prev => ({
          ...prev,
          totalReels: (prev.totalReels || 0) + 1
        }));
      }
    } catch (err) {
      if (showToast) showToast(err.message, 'error');
    } finally {
      setReelLoading(false);
    }
  };

  const handleInquiryStatus = (id, newStatus) => {
    setMentorshipRequests(prev =>
      prev.map(req => req.id === id ? { ...req, status: newStatus } : req)
    );
    if (showToast) {
      showToast(newStatus === 'accepted' ? 'Mentorship request accepted!' : 'Request declined', newStatus === 'accepted' ? 'success' : 'info');
    }
  };

  const filteredStudents = students.filter(s =>
    s.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (s.major && s.major.toLowerCase().includes(searchQuery.toLowerCase())) ||
    s.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (activeTab === 'post-job') {
    return (
      <div style={{ maxWidth: '640px', margin: '0 auto' }}>
        <div style={{ marginBottom: '30px' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '6px' }}>Post a Job / Internship</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Share career opportunities and internal referral openings with Hive students.</p>
        </div>

        <div className="glass-panel-dark" style={{ padding: '30px', boxShadow: 'var(--shadow-premium)' }}>
          <form onSubmit={handlePostJob} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '8px', fontWeight: 500 }}>
                  Job Title *
                </label>
                <input
                  type="text"
                  className="glass-input"
                  placeholder="e.g. Software Engineer Intern"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  disabled={jobLoading}
                  required
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '8px', fontWeight: 500 }}>
                  Company Name *
                </label>
                <input
                  type="text"
                  className="glass-input"
                  placeholder="e.g. Google"
                  value={jobCompany}
                  onChange={(e) => setJobCompany(e.target.value)}
                  disabled={jobLoading}
                  required
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '8px', fontWeight: 500 }}>
                  Location
                </label>
                <input
                  type="text"
                  className="glass-input"
                  placeholder="e.g. Mountain View, CA (Hybrid)"
                  value={jobLocation}
                  onChange={(e) => setJobLocation(e.target.value)}
                  disabled={jobLoading}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '8px', fontWeight: 500 }}>
                  Compensation Range
                </label>
                <input
                  type="text"
                  className="glass-input"
                  placeholder="e.g. $45 - $60 / hr"
                  value={jobSalary}
                  onChange={(e) => setJobSalary(e.target.value)}
                  disabled={jobLoading}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '8px', fontWeight: 500 }}>
                Description & Application Details *
              </label>
              <textarea
                className="glass-input"
                placeholder="Include responsibilities, tech requirements, and how students should apply..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                style={{ minHeight: '140px', resize: 'vertical' }}
                disabled={jobLoading}
                required
              />
            </div>

            <button type="submit" className="btn-premium" style={{ width: '100%', marginTop: '10px' }} disabled={jobLoading}>
              {jobLoading ? 'Posting...' : (
                <>
                  <PlusSquare size={18} /> Publish Job Opportunity
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (activeTab === 'post-reel') {
    return (
      <div style={{ maxWidth: '640px', margin: '0 auto' }}>
        <div style={{ marginBottom: '30px' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '6px' }}>Upload Alumni Reel</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Upload vertical video reels from your device or share Google Drive / MP4 links.</p>
        </div>

        <div className="glass-panel-dark" style={{ padding: '30px', boxShadow: 'var(--shadow-premium)' }}>
          {/* Toggle Reel Source */}
          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
            <button
              type="button"
              onClick={() => setReelUploadMode('file')}
              style={{
                flex: 1,
                padding: '10px 14px',
                borderRadius: '8px',
                border: 'none',
                background: reelUploadMode === 'file' ? 'var(--gradient-accent)' : 'rgba(255,255,255,0.05)',
                color: reelUploadMode === 'file' ? '#ffffff' : 'var(--text-secondary)',
                fontWeight: 600,
                fontSize: '0.85rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}
            >
              <Upload size={16} /> Device Upload (MP4 / MOV)
            </button>
            <button
              type="button"
              onClick={() => setReelUploadMode('url')}
              style={{
                flex: 1,
                padding: '10px 14px',
                borderRadius: '8px',
                border: 'none',
                background: reelUploadMode === 'url' ? 'var(--gradient-accent)' : 'rgba(255,255,255,0.05)',
                color: reelUploadMode === 'url' ? '#ffffff' : 'var(--text-secondary)',
                fontWeight: 600,
                fontSize: '0.85rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}
            >
              <Link size={16} /> Google Drive / Direct MP4 URL
            </button>
          </div>

          <form onSubmit={handleUploadReel} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {reelUploadMode === 'file' ? (
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '8px', fontWeight: 500 }}>
                  Select Video File from Device *
                </label>
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleVideoFileChange}
                  className="glass-input"
                  style={{ padding: '10px' }}
                  disabled={reelLoading}
                />
              </div>
            ) : (
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '8px', fontWeight: 500 }}>
                  Google Drive / Direct MP4 Video URL *
                </label>
                <input
                  type="url"
                  className="glass-input"
                  placeholder="https://drive.google.com/... or https://assets.mixkit.co/..."
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  disabled={reelLoading}
                />
              </div>
            )}

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '8px', fontWeight: 500 }}>
                Reel Caption
              </label>
              <textarea
                className="glass-input"
                placeholder="Write a descriptive caption or add mentorship hashtags..."
                value={reelCaption}
                onChange={(e) => setReelCaption(e.target.value)}
                style={{ minHeight: '80px', resize: 'vertical' }}
                disabled={reelLoading}
              />
            </div>

            {videoUrl && (
              <div style={{ textAlign: 'center', marginTop: '10px' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Video preview:</span>
                <video
                  src={videoUrl}
                  style={{
                    width: '120px',
                    height: '200px',
                    objectFit: 'cover',
                    borderRadius: '12px',
                    display: 'block',
                    margin: '10px auto',
                    border: '1px solid var(--border-glass)'
                  }}
                  muted
                  controls
                />
              </div>
            )}

            <button type="submit" className="btn-premium" style={{ width: '100%', marginTop: '10px' }} disabled={reelLoading}>
              {reelLoading ? 'Uploading...' : (
                <>
                  <Film size={18} /> Upload Reel to Feed
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // default: 'dashboard'
  return (
    <div>
      <div style={{ marginBottom: '30px' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '6px' }}>
          Welcome back, <span style={{ background: 'var(--gradient-accent)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{stats.fullName || 'Alumnus'}</span>! 💼
        </h2>
        <p style={{ color: 'var(--text-secondary)' }}>Guide students, manage your job postings, upload reels, and answer mentorship inquiries.</p>
      </div>

      {/* Stats Cards */}
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
            <Briefcase size={28} />
          </div>
          <div>
            <h4 style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 500 }}>Jobs Posted</h4>
            <h3 style={{ fontSize: '1.8rem', fontWeight: 800 }}>{stats.jobsPostedCount || 0}</h3>
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
            <h4 style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 500 }}>Student Followers</h4>
            <h3 style={{ fontSize: '1.8rem', fontWeight: 800 }}>{stats.followersCount || 0}</h3>
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
            <Users size={28} />
          </div>
          <div>
            <h4 style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 500 }}>Total Students</h4>
            <h3 style={{ fontSize: '1.8rem', fontWeight: 800 }}>{stats.studentsCount || 0}</h3>
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
            <h4 style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 500 }}>Total Reels</h4>
            <h3 style={{ fontSize: '1.8rem', fontWeight: 800 }}>{stats.totalReels || 0}</h3>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '30px', alignItems: 'start' }}>
        {/* Left Side: Students Directory */}
        <div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px'
          }}>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 700 }}>Students Directory</h3>
            <input
              type="text"
              placeholder="Search students..."
              className="glass-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: '200px', fontSize: '0.85rem', padding: '8px 12px' }}
            />
          </div>

          {loadingStudents ? (
            <SkeletonLoader count={3} type="card" />
          ) : filteredStudents.length === 0 ? (
            <div className="glass-panel" style={{ padding: '20px', textAlign: 'center', color: 'var(--text-secondary)' }}>
              No students found.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {filteredStudents.map(student => (
                <div key={student.id} className="glass-card" style={{ padding: '16px', display: 'flex', gap: '14px', alignItems: 'center' }}>
                  <img
                    src={student.profilePicture || `https://api.dicebear.com/7.x/adventurer/svg?seed=${student.username}`}
                    alt={student.fullName}
                    style={{ width: '50px', height: '50px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', objectFit: 'cover' }}
                  />
                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: '700' }}>{student.fullName}</h4>
                    <p style={{ fontSize: '0.75rem', color: 'var(--accent-purple)', fontWeight: 600 }}>
                      {student.major} • Class of {student.graduationYear}
                    </p>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px', fontStyle: 'italic' }}>
                      "{student.bio || 'Seeking professional guidance.'}"
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Side: Mentorship Inquiries Inbox */}
        <div>
          <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '20px' }}>Mentorship Inbox</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {mentorshipRequests.map(req => (
              <div key={req.id} className="glass-panel" style={{ padding: '18px', borderLeft: req.status === 'pending' ? '4px solid var(--accent-purple)' : req.status === 'accepted' ? '4px solid #10b981' : '4px solid #ef4444' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <div>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: '700' }}>{req.studentName}</h4>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{req.major} (Class of {req.year})</span>
                  </div>
                  {req.status === 'accepted' && (
                    <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 600, background: 'rgba(16, 185, 129, 0.1)', padding: '2px 8px', borderRadius: '4px' }}>Accepted</span>
                  )}
                  {req.status === 'declined' && (
                    <span style={{ fontSize: '0.75rem', color: '#ef4444', fontWeight: 600, background: 'rgba(239, 68, 68, 0.1)', padding: '2px 8px', borderRadius: '4px' }}>Declined</span>
                  )}
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.4', marginBottom: '14px' }}>
                  "{req.message}"
                </p>
                {req.status === 'pending' && (
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      onClick={() => handleInquiryStatus(req.id, 'accepted')}
                      className="btn-premium"
                      style={{ flex: 1, padding: '8px 12px', fontSize: '0.8rem', background: '#10b981' }}
                    >
                      <Check size={14} /> Accept Request
                    </button>
                    <button
                      onClick={() => handleInquiryStatus(req.id, 'declined')}
                      className="btn-secondary"
                      style={{ flex: 1, padding: '8px 12px', fontSize: '0.8rem', borderColor: 'rgba(239, 68, 68, 0.2)', color: '#ef4444' }}
                    >
                      <X size={14} /> Decline
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
