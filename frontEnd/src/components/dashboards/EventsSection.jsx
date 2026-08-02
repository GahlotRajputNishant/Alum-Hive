import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Video, Plus, Trash2, ExternalLink } from 'lucide-react';
import SkeletonLoader from '../common/SkeletonLoader';

export default function EventsSection({ user, showToast }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [locationOrLink, setLocationOrLink] = useState('');
  const [eventType, setEventType] = useState('WEBINAR');
  const [submitting, setSubmitting] = useState(false);

  const fetchEvents = async () => {
    try {
      const response = await fetch('https://6a6c4e39c0679e65f1aa677d-api-capstone.myanatomy.ai/api/events', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (response.ok) {
        const data = await response.json();
        setEvents(data);
      }
    } catch (err) {
      console.error('Error fetching events:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    if (!title || !eventDate) return;

    setSubmitting(true);
    try {
      const response = await fetch('https://6a6c4e39c0679e65f1aa677d-api-capstone.myanatomy.ai/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          title,
          description,
          eventDate,
          locationOrLink,
          eventType
        })
      });

      if (response.ok) {
        const newEvent = await response.json();
        setEvents(prev => [newEvent, ...prev]);
        setShowCreateModal(false);
        setTitle('');
        setDescription('');
        setEventDate('');
        setLocationOrLink('');
        if (showToast) showToast('Event published successfully!', 'success');
      }
    } catch (err) {
      console.error(err);
      if (showToast) showToast('Failed to post event', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteEvent = async (id) => {
    try {
      const response = await fetch(`https://6a6c4e39c0679e65f1aa677d-api-capstone.myanatomy.ai/api/events/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (response.ok) {
        setEvents(prev => prev.filter(e => e.id !== id));
        if (showToast) showToast('Event deleted', 'info');
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '6px' }}>Events & Webinars</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Live sessions, Q&As, and workshops organized by our Alumni Mentors.</p>
        </div>

        {(user.role === 'ALUMNI' || user.role === 'ADMIN') && (
          <button onClick={() => setShowCreateModal(true)} className="btn-premium">
            <Plus size={18} /> Host New Event
          </button>
        )}
      </div>

      {/* Events Grid */}
      {loading ? (
        <SkeletonLoader count={3} type="card" />
      ) : events.length === 0 ? (
        <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
          No upcoming events scheduled. Check back soon!
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
          {events.map(ev => (
            <div key={ev.id} className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <span style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  padding: '3px 10px',
                  borderRadius: '6px',
                  background: ev.eventType === 'WEBINAR' ? 'rgba(59, 130, 246, 0.2)' : 'rgba(139, 92, 246, 0.2)',
                  color: ev.eventType === 'WEBINAR' ? 'var(--accent-blue)' : 'var(--accent-purple)'
                }}>
                  {ev.eventType}
                </span>

                {(user.role === 'ADMIN' || (ev.organizer && ev.organizer.id === user.userId)) && (
                  <button
                    onClick={() => handleDeleteEvent(ev.id)}
                    style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '4px' }}
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>

              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '8px' }}>{ev.title}</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '16px', flex: 1, lineHeight: '1.5' }}>
                {ev.description || 'Join us for an insightful session with alumni industry veterans.'}
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Calendar size={16} style={{ color: 'var(--accent-purple)' }} />
                  <span>{ev.eventDate}</span>
                </div>
                {ev.locationOrLink && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Video size={16} style={{ color: 'var(--accent-blue)' }} />
                    <span style={{ wordBreak: 'break-all' }}>{ev.locationOrLink}</span>
                  </div>
                )}
              </div>

              {ev.organizer && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingTop: '12px', borderTop: '1px solid var(--border-glass)' }}>
                  <img
                    src={ev.organizer.profilePicture || `https://api.dicebear.com/7.x/adventurer/svg?seed=${ev.organizer.username}`}
                    alt={ev.organizer.fullName}
                    style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }}
                  />
                  <div>
                    <span style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block' }}>{ev.organizer.fullName}</span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{ev.organizer.company || 'Alumnus Host'}</span>
                  </div>
                </div>
              )}

              {ev.locationOrLink && (
                <a
                  href={ev.locationOrLink.startsWith('http') ? ev.locationOrLink : `https://${ev.locationOrLink}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-premium"
                  style={{ marginTop: '16px', width: '100%', fontSize: '0.85rem', padding: '10px' }}
                >
                  <ExternalLink size={14} /> Join Event Stream
                </a>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Modal for creating events */}
      {showCreateModal && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.75)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div className="glass-panel-dark" style={{ width: '100%', maxWidth: '500px', padding: '30px' }}>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '20px' }}>Schedule New Event</h3>
            <form onSubmit={handleCreateEvent} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>Event Title *</label>
                <input
                  type="text"
                  className="glass-input"
                  placeholder="e.g. System Design Interview Workshop"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>Event Category</label>
                <select
                  className="glass-input"
                  value={eventType}
                  onChange={(e) => setEventType(e.target.value)}
                  style={{ cursor: 'pointer' }}
                >
                  <option value="WEBINAR">Webinar</option>
                  <option value="WORKSHOP">Workshop / Live Coding</option>
                  <option value="MEETUP">Alumni Meetup</option>
                  <option value="Q_AND_A">AMA / Q&A Session</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>Date & Time *</label>
                <input
                  type="text"
                  className="glass-input"
                  placeholder="e.g. Aug 15, 2026 • 6:00 PM IST"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>Video Link / Location</label>
                <input
                  type="text"
                  className="glass-input"
                  placeholder="e.g. https://meet.google.com/abc-defg"
                  value={locationOrLink}
                  onChange={(e) => setLocationOrLink(e.target.value)}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>Description</label>
                <textarea
                  className="glass-input"
                  rows={3}
                  placeholder="Event agenda and details..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
                <button type="button" onClick={() => setShowCreateModal(false)} className="btn-secondary" style={{ flex: 1 }}>
                  Cancel
                </button>
                <button type="submit" className="btn-premium" style={{ flex: 1 }} disabled={submitting}>
                  {submitting ? 'Publishing...' : 'Publish Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
