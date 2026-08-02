import React, { useState } from 'react';
import { 
  GraduationCap, Briefcase, Film, Users, Sparkles, ArrowRight, 
  CheckCircle2, Globe, Shield, MessageSquare, Zap, Heart, Play
} from 'lucide-react';

export default function HomePage({ onNavigateToLogin, onNavigateToRegister }) {
  const [activeTab, setActiveTab] = useState('students');

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', color: 'var(--text-primary)', position: 'relative', overflowX: 'hidden' }}>
      {/* Decorative Glow Spots */}
      <div className="glow-spot glow-spot-1" style={{ width: '500px', height: '500px', top: '-150px', right: '-100px' }} />
      <div className="glow-spot glow-spot-2" style={{ width: '450px', height: '450px', bottom: '100px', left: '-100px' }} />

      {/* Navigation Navbar */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: 'rgba(8, 12, 20, 0.8)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--border-glass)',
        padding: '16px 40px'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              background: 'var(--gradient-accent)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              fontWeight: 800,
              fontSize: '1.3rem',
              color: '#ffffff',
              boxShadow: 'var(--shadow-glow)'
            }}>
              H
            </div>
            <div>
              <h1 style={{ fontSize: '1.4rem', fontWeight: 800, letterSpacing: '-0.5px' }}>Alumni Hive</h1>
              <span style={{ fontSize: '0.7rem', color: 'var(--accent-purple)', fontWeight: 600, letterSpacing: '0.5px' }}>CONNECT • MENTOR • EXCEL</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <button onClick={onNavigateToLogin} className="btn-secondary" style={{ padding: '10px 20px', fontSize: '0.9rem' }}>
              Sign In
            </button>
            <button onClick={onNavigateToRegister} className="btn-premium" style={{ padding: '10px 22px', fontSize: '0.9rem' }}>
              Join Community <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section style={{ padding: '80px 20px 60px', textAlign: 'center', position: 'relative', zIndex: 1, maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 16px',
          borderRadius: '30px',
          background: 'rgba(139, 92, 246, 0.12)',
          border: '1px solid rgba(139, 92, 246, 0.3)',
          color: 'var(--accent-purple)',
          fontSize: '0.85rem',
          fontWeight: 600,
          marginBottom: '24px'
        }}>
          <Sparkles size={16} /> Empowering the Next Generation of Tech Leaders
        </div>

        <h1 style={{
          fontSize: 'clamp(2.5rem, 5vw, 4.2rem)',
          fontWeight: 900,
          lineHeight: '1.15',
          letterSpacing: '-1.5px',
          marginBottom: '24px'
        }}>
          Where College Legacy Meets <br />
          <span style={{
            background: 'var(--gradient-accent)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Real-World Tech Opportunities
          </span>
        </h1>

        <p style={{
          fontSize: '1.15rem',
          color: 'var(--text-secondary)',
          maxWidth: '740px',
          margin: '0 auto 36px',
          lineHeight: '1.6'
        }}>
          Alumni Hive bridges the gap between current students, alumni working at top tech firms, and campus administrators. Follow mentors, explore short tech reels, and apply for exclusive internships.
        </p>

        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '60px' }}>
          <button onClick={onNavigateToRegister} className="btn-premium" style={{ padding: '14px 32px', fontSize: '1.05rem', borderRadius: '12px' }}>
            Get Started Free <ArrowRight size={18} />
          </button>
          <button onClick={onNavigateToLogin} className="btn-secondary" style={{ padding: '14px 28px', fontSize: '1.05rem', borderRadius: '12px' }}>
            Explore Platform
          </button>
        </div>

        {/* Hero Visual Mockup Grid */}
        <div className="glass-panel-dark" style={{
          padding: '30px',
          borderRadius: '24px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 30px rgba(139, 92, 246, 0.15)',
          border: '1px solid var(--border-glass)'
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', textAlign: 'left' }}>
            {/* Feature preview 1 */}
            <div className="glass-card" style={{ padding: '24px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'rgba(59, 130, 246, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-blue)', marginBottom: '16px' }}>
                <Users size={24} />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '8px' }}>Follow & Connect</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                Students can follow alumni working at Google, Meta, and top startups for personalized guidance & career updates.
              </p>
            </div>

            {/* Feature preview 2 */}
            <div className="glass-card" style={{ padding: '24px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'rgba(217, 70, 239, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-pink)', marginBottom: '16px' }}>
                <Film size={24} />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '8px' }}>Tech Reels & Stories</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                Alumni post bite-sized video reels sharing code snippets, tech culture, interview tips, and office tours.
              </p>
            </div>

            {/* Feature preview 3 */}
            <div className="glass-card" style={{ padding: '24px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981', marginBottom: '16px' }}>
                <Briefcase size={24} />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '8px' }}>Internship & Job Board</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                Verified alumni directly list internal referral roles, internship application forms, and remote gigs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Role Showcase Section */}
      <section style={{ padding: '80px 20px', background: 'rgba(15, 23, 42, 0.4)', borderTop: '1px solid var(--border-glass)', borderBottom: '1px solid var(--border-glass)' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '12px' }}>Tailored for Every Role in the Campus Hive</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>Select a user role to see customized dashboard capabilities.</p>
            
            <div style={{ display: 'inline-flex', gap: '10px', background: 'rgba(3, 7, 18, 0.6)', padding: '6px', borderRadius: '12px', marginTop: '24px', border: '1px solid var(--border-glass)' }}>
              {[
                { id: 'students', label: 'Students', icon: <GraduationCap size={18} /> },
                { id: 'alumni', label: 'Alumni Mentors', icon: <Briefcase size={18} /> },
                { id: 'admin', label: 'Administrators', icon: <Shield size={18} /> },
              ].map(role => (
                <button
                  key={role.id}
                  onClick={() => setActiveTab(role.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 20px',
                    borderRadius: '8px',
                    border: 'none',
                    background: activeTab === role.id ? 'var(--gradient-accent)' : 'transparent',
                    color: activeTab === role.id ? '#ffffff' : 'var(--text-secondary)',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {role.icon} {role.label}
                </button>
              ))}
            </div>
          </div>

          {/* Role specific content card */}
          <div className="glass-panel" style={{ padding: '40px', borderRadius: '20px' }}>
            {activeTab === 'students' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', alignItems: 'center' }}>
                <div>
                  <h3 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '16px' }}>Accelerate Your Tech Career</h3>
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <li style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
                      <CheckCircle2 size={20} style={{ color: '#10b981', flexShrink: 0, marginTop: '2px' }} />
                      <span><strong>Follow Alumni:</strong> Stay connected with alumni working at your dream companies.</span>
                    </li>
                    <li style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
                      <CheckCircle2 size={20} style={{ color: '#10b981', flexShrink: 0, marginTop: '2px' }} />
                      <span><strong>Request Mentorship:</strong> Send direct 1-on-1 mentorship requests with personalized notes.</span>
                    </li>
                    <li style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
                      <CheckCircle2 size={20} style={{ color: '#10b981', flexShrink: 0, marginTop: '2px' }} />
                      <span><strong>Interactive Reels:</strong> Double-tap to like, comment, and learn from tech reel snippets.</span>
                    </li>
                  </ul>
                  <button onClick={onNavigateToRegister} className="btn-premium" style={{ marginTop: '28px' }}>
                    Register as Student <ArrowRight size={16} />
                  </button>
                </div>
                <div className="glass-card" style={{ padding: '24px', textAlign: 'center', background: 'rgba(59, 130, 246, 0.05)' }}>
                  <GraduationCap size={64} style={{ color: 'var(--accent-blue)', marginBottom: '16px' }} />
                  <h4 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Student Portal Preview</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '8px' }}>
                    Explore alumni mentors by major, track job applications, and participate in Q&A live streams.
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'alumni' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', alignItems: 'center' }}>
                <div>
                  <h3 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '16px' }}>Give Back & Guide Next-Gen Talent</h3>
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <li style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
                      <CheckCircle2 size={20} style={{ color: 'var(--accent-purple)', flexShrink: 0, marginTop: '2px' }} />
                      <span><strong>Post Job Opportunities:</strong> Share internal referrals, internships, and entry-level openings.</span>
                    </li>
                    <li style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
                      <CheckCircle2 size={20} style={{ color: 'var(--accent-purple)', flexShrink: 0, marginTop: '2px' }} />
                      <span><strong>Upload Video Reels & Photos:</strong> Share short career advice, office tours, and event photos.</span>
                    </li>
                    <li style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
                      <CheckCircle2 size={20} style={{ color: 'var(--accent-purple)', flexShrink: 0, marginTop: '2px' }} />
                      <span><strong>Host Webinars:</strong> Schedule live webinars and Q&A sessions for students.</span>
                    </li>
                  </ul>
                  <button onClick={onNavigateToRegister} className="btn-premium" style={{ marginTop: '28px' }}>
                    Register as Alumni <ArrowRight size={16} />
                  </button>
                </div>
                <div className="glass-card" style={{ padding: '24px', textAlign: 'center', background: 'rgba(139, 92, 246, 0.05)' }}>
                  <Briefcase size={64} style={{ color: 'var(--accent-purple)', marginBottom: '16px' }} />
                  <h4 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Alumni Portal Preview</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '8px' }}>
                    Manage student mentorship inbox, upload photos/reels, and publish job listings with salary ranges.
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'admin' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', alignItems: 'center' }}>
                <div>
                  <h3 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '16px' }}>Total System Oversight & Control</h3>
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <li style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
                      <CheckCircle2 size={20} style={{ color: 'var(--accent-pink)', flexShrink: 0, marginTop: '2px' }} />
                      <span><strong>User Management:</strong> Master directory of all students & alumni with account controls.</span>
                    </li>
                    <li style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
                      <CheckCircle2 size={20} style={{ color: 'var(--accent-pink)', flexShrink: 0, marginTop: '2px' }} />
                      <span><strong>Content Moderation:</strong> Review and moderate inappropriate reels, posts, and comments.</span>
                    </li>
                    <li style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
                      <CheckCircle2 size={20} style={{ color: 'var(--accent-pink)', flexShrink: 0, marginTop: '2px' }} />
                      <span><strong>Live Metrics:</strong> Track total users, active jobs, reel engagements, and server health.</span>
                    </li>
                  </ul>
                  <button onClick={onNavigateToRegister} className="btn-premium" style={{ marginTop: '28px' }}>
                    Register as Admin <ArrowRight size={16} />
                  </button>
                </div>
                <div className="glass-card" style={{ padding: '24px', textAlign: 'center', background: 'rgba(217, 70, 239, 0.05)' }}>
                  <Shield size={64} style={{ color: 'var(--accent-pink)', marginBottom: '16px' }} />
                  <h4 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Admin Portal Preview</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '8px' }}>
                    Full administrative dashboard with analytical breakdowns, database metrics, and moderation tools.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Community Stats Banner */}
      <section style={{ padding: '60px 20px', textAlign: 'center' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px' }}>
            <div className="glass-card" style={{ padding: '28px' }}>
              <h3 style={{ fontSize: '2.5rem', fontWeight: 900, background: 'var(--gradient-accent)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>500+</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>Alumni Mentors Registered</p>
            </div>
            <div className="glass-card" style={{ padding: '28px' }}>
              <h3 style={{ fontSize: '2.5rem', fontWeight: 900, background: 'var(--gradient-accent)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>1,200+</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>Active Student Members</p>
            </div>
            <div className="glass-card" style={{ padding: '28px' }}>
              <h3 style={{ fontSize: '2.5rem', fontWeight: 900, background: 'var(--gradient-accent)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>150+</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>Jobs & Internships Posted</p>
            </div>
            <div className="glass-card" style={{ padding: '28px' }}>
              <h3 style={{ fontSize: '2.5rem', fontWeight: 900, background: 'var(--gradient-accent)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>98%</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>Mentorship Response Rate</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <footer style={{
        background: 'rgba(3, 7, 18, 0.9)',
        borderTop: '1px solid var(--border-glass)',
        padding: '40px 20px',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '12px' }}>Ready to Join the Hive?</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', fontSize: '0.95rem' }}>
            Register your account today as a student, alumni, or administrator and start networking.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
            <button onClick={onNavigateToRegister} className="btn-premium" style={{ padding: '12px 28px' }}>
              Register Now <ArrowRight size={16} />
            </button>
            <button onClick={onNavigateToLogin} className="btn-secondary" style={{ padding: '12px 24px' }}>
              Sign In
            </button>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '40px' }}>
            © 2026 Alumni Hive Portal. Powered by Spring Boot, React & MongoDB.
          </p>
        </div>
      </footer>
    </div>
  );
}
