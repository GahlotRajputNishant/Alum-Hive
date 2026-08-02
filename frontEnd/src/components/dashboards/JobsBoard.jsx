import React, { useState, useEffect } from 'react';
import { Briefcase, MapPin, DollarSign, Search, ExternalLink, CheckCircle2, RotateCcw } from 'lucide-react';
import SkeletonLoader from '../common/SkeletonLoader';

export default function JobsBoard({ showToast }) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedJob, setSelectedJob] = useState(null);
  
  // Persistent applications map in localStorage (jobId -> true/false)
  const [appliedJobs, setAppliedJobs] = useState(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const saved = localStorage.getItem(`applied_jobs_${user.userId}`);
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch('https://6a6c4e39c0679e65f1aa677d-api-capstone.myanatomy.ai/api/jobs', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setJobs(data);
          if (data.length > 0) {
            setSelectedJob(data[0]);
          }
        }
      } catch (err) {
        console.error('Error fetching jobs:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const handleApply = (jobId, title) => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const updated = { ...appliedJobs, [jobId]: true };
    setAppliedJobs(updated);
    localStorage.setItem(`applied_jobs_${user.userId}`, JSON.stringify(updated));

    if (showToast) showToast(`Application submitted for "${title}"!`, 'success');
  };

  const handleWithdraw = (jobId, title) => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const updated = { ...appliedJobs };
    delete updated[jobId];
    setAppliedJobs(updated);
    localStorage.setItem(`applied_jobs_${user.userId}`, JSON.stringify(updated));

    if (showToast) showToast(`Application withdrawn for "${title}".`, 'info');
  };

  const filteredJobs = jobs.filter(job =>
    job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (job.location && job.location.toLowerCase().includes(searchQuery.toLowerCase())) ||
    job.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <div style={{ marginBottom: '30px' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '6px' }}>Opportunity Board</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Explore job postings, internships, and internal referrals shared by alumni.</p>
      </div>

      {/* Search Bar */}
      <div style={{ position: 'relative', maxWidth: '500px', marginBottom: '30px' }}>
        <Search size={18} style={{
          position: 'absolute',
          left: '14px',
          top: '50%',
          transform: 'translateY(-50%)',
          color: 'var(--text-muted)'
        }} />
        <input
          type="text"
          placeholder="Search jobs by title, company, keywords..."
          className="glass-input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ paddingLeft: '42px' }}
        />
      </div>

      {loading ? (
        <SkeletonLoader count={3} type="card" />
      ) : filteredJobs.length === 0 ? (
        <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
          No opportunities listed yet. Alumni can post roles from their dashboard!
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '30px', alignItems: 'start' }}>
          {/* Left Column: Job Cards List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: 'calc(100vh - 200px)', overflowY: 'auto', paddingRight: '8px' }}>
            {filteredJobs.map(job => {
              const isSelected = selectedJob && selectedJob.id === job.id;
              const isApplied = appliedJobs[job.id];
              return (
                <div
                  key={job.id}
                  onClick={() => setSelectedJob(job)}
                  className="glass-card"
                  style={{
                    padding: '20px',
                    cursor: 'pointer',
                    borderColor: isSelected ? 'var(--accent-purple)' : 'var(--border-glass)',
                    background: isSelected ? 'rgba(139, 92, 246, 0.08)' : 'var(--gradient-card)',
                    transform: isSelected ? 'translateY(-2px)' : 'none',
                    boxShadow: isSelected ? '0 4px 20px rgba(139, 92, 246, 0.2)' : 'none'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                    <h4 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{job.title}</h4>
                    {isApplied && (
                      <span style={{
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        padding: '2px 8px',
                        borderRadius: '4px',
                        background: 'rgba(16, 185, 129, 0.15)',
                        color: '#10b981'
                      }}>
                        APPLIED
                      </span>
                    )}
                  </div>
                  <p style={{ fontSize: '0.9rem', color: 'var(--accent-blue)', fontWeight: 600, marginBottom: '12px' }}>{job.company}</p>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    {job.location && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <MapPin size={14} /> {job.location}
                      </span>
                    )}
                    {job.salaryRange && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <DollarSign size={14} /> {job.salaryRange}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Detailed View */}
          {selectedJob && (
            <div className="glass-panel-dark" style={{ padding: '30px', position: 'sticky', top: '20px' }}>
              <div style={{ borderBottom: '1px solid var(--border-glass)', paddingBottom: '20px', marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '6px' }}>{selectedJob.title}</h3>
                    <p style={{ fontSize: '1.1rem', color: 'var(--accent-purple)', fontWeight: 600, marginBottom: '16px' }}>{selectedJob.company}</p>
                  </div>
                  {appliedJobs[selectedJob.id] && (
                    <span style={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      padding: '4px 10px',
                      borderRadius: '6px',
                      background: 'rgba(16, 185, 129, 0.15)',
                      color: '#10b981',
                      border: '1px solid #10b981'
                    }}>
                      ✓ Application Submitted
                    </span>
                  )}
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                  {selectedJob.location && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <MapPin size={16} style={{ color: 'var(--accent-blue)' }} /> {selectedJob.location}
                    </div>
                  )}
                  {selectedJob.salaryRange && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <DollarSign size={16} style={{ color: '#10b981' }} /> {selectedJob.salaryRange}
                    </div>
                  )}
                </div>
              </div>

              {/* Job Description */}
              <div style={{ marginBottom: '30px' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '10px' }}>Job Description</h4>
                <p style={{
                  color: 'var(--text-secondary)',
                  fontSize: '0.925rem',
                  lineHeight: '1.6',
                  whiteSpace: 'pre-wrap'
                }}>
                  {selectedJob.description}
                </p>
              </div>

              {/* Posted By Alumnus */}
              {selectedJob.postedBy && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid var(--border-glass)',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  marginBottom: '30px'
                }}>
                  <img
                    src={selectedJob.postedBy.profilePicture || `https://api.dicebear.com/7.x/adventurer/svg?seed=${selectedJob.postedBy.username}`}
                    alt={selectedJob.postedBy.fullName}
                    style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', objectFit: 'cover' }}
                  />
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Posted By Alumni</span>
                    <span style={{ fontSize: '0.9rem', fontWeight: '600' }}>
                      {selectedJob.postedBy.fullName} ({selectedJob.postedBy.jobTitle} @ {selectedJob.postedBy.company})
                    </span>
                  </div>
                </div>
              )}

              {/* Apply / Withdraw Actions */}
              {appliedJobs[selectedJob.id] ? (
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    disabled
                    className="btn-premium"
                    style={{
                      flex: 2,
                      background: 'rgba(16, 185, 129, 0.15)',
                      border: '1px solid #10b981',
                      color: '#10b981',
                      cursor: 'default'
                    }}
                  >
                    <CheckCircle2 size={18} /> Application Submitted
                  </button>
                  <button
                    onClick={() => handleWithdraw(selectedJob.id, selectedJob.title)}
                    className="btn-secondary"
                    style={{
                      flex: 1,
                      borderColor: 'rgba(239, 68, 68, 0.3)',
                      color: '#ef4444'
                    }}
                  >
                    <RotateCcw size={16} /> Withdraw
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => handleApply(selectedJob.id, selectedJob.title)}
                  className="btn-premium"
                  style={{ width: '100%' }}
                >
                  <ExternalLink size={16} /> Apply Now
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
