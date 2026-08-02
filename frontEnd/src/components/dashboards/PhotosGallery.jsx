import React, { useState, useEffect } from 'react';
import { Image, Plus, Trash2, Camera, Upload, Link } from 'lucide-react';
import SkeletonLoader from '../common/SkeletonLoader';

export default function PhotosGallery({ user, showToast }) {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);
  
  // Upload mode: 'file' or 'url'
  const [uploadMode, setUploadMode] = useState('file');
  const [imageUrl, setImageUrl] = useState('');
  const [caption, setCaption] = useState('');
  const [category, setCategory] = useState('EVENT');
  const [submitting, setSubmitting] = useState(false);

  const fetchPhotos = async () => {
    try {
      const response = await fetch('https://6a6c4e39c0679e65f1aa677d-api-capstone.myanatomy.ai/api/photos', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (response.ok) {
        const data = await response.json();
        setPhotos(data);
      }
    } catch (err) {
      console.error('Error fetching photos:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPhotos();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result); // Data URL Base64
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadPhoto = async (e) => {
    e.preventDefault();
    if (!imageUrl) {
      if (showToast) showToast('Please select a photo file or provide an Image URL', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch('https://6a6c4e39c0679e65f1aa677d-api-capstone.myanatomy.ai/api/photos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ imageUrl, caption, category })
      });

      if (response.ok) {
        const newPhoto = await response.json();
        setPhotos(prev => [newPhoto, ...prev]);
        setShowUploadModal(false);
        setImageUrl('');
        setCaption('');
        if (showToast) showToast('Photo added to gallery successfully!', 'success');
      }
    } catch (err) {
      console.error(err);
      if (showToast) showToast('Failed to upload photo', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeletePhoto = async (id) => {
    try {
      const response = await fetch(`https://6a6c4e39c0679e65f1aa677d-api-capstone.myanatomy.ai/api/photos/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (response.ok) {
        setPhotos(prev => prev.filter(p => p.id !== id));
        if (showToast) showToast('Photo removed', 'info');
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '6px' }}>Alumni Photo Gallery</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Moments from campus tech fests, alumni summits, workplaces, and mentorship workshops.</p>
        </div>

        {(user.role === 'ALUMNI' || user.role === 'ADMIN') && (
          <button onClick={() => setShowUploadModal(true)} className="btn-premium">
            <Plus size={18} /> Upload Photo
          </button>
        )}
      </div>

      {loading ? (
        <SkeletonLoader count={4} type="card" />
      ) : photos.length === 0 ? (
        <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
          No photos shared in the gallery yet. Alumni can upload workplace and event memories from their device or Google Drive!
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '24px'
        }}>
          {photos.map(p => (
            <div key={p.id} className="glass-card" style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ position: 'relative', width: '100%', height: '220px', overflow: 'hidden' }}>
                <img
                  src={p.imageUrl}
                  alt={p.caption || 'Alumni photo'}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s ease' }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                />
                <span style={{
                  position: 'absolute',
                  top: '12px',
                  left: '12px',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  padding: '3px 8px',
                  borderRadius: '4px',
                  background: 'rgba(0,0,0,0.6)',
                  backdropFilter: 'blur(4px)',
                  color: '#ffffff'
                }}>
                  {p.category}
                </span>

                {(user.role === 'ADMIN' || (p.uploader && p.uploader.id === user.userId)) && (
                  <button
                    onClick={() => handleDeletePhoto(p.id)}
                    style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      background: 'rgba(239, 68, 68, 0.8)',
                      border: 'none',
                      color: '#ffffff',
                      borderRadius: '50%',
                      width: '32px',
                      height: '32px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer'
                    }}
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>

              <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)', marginBottom: '12px', fontWeight: 500, lineHeight: '1.4' }}>
                  {p.caption || 'Alumni memory snapshot.'}
                </p>

                {p.uploader && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: 'auto', paddingTop: '10px', borderTop: '1px solid var(--border-glass)' }}>
                    <img
                      src={p.uploader.profilePicture || `https://api.dicebear.com/7.x/adventurer/svg?seed=${p.uploader.username}`}
                      alt={p.uploader.fullName}
                      style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }}
                    />
                    <span style={{ fontSize: '0.785rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                      Uploaded by {p.uploader.fullName}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal for uploading photo with Device File or Drive URL option */}
      {showUploadModal && (
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
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '16px' }}>Add Photo to Gallery</h3>

            {/* Toggle Mode Buttons */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
              <button
                type="button"
                onClick={() => setUploadMode('file')}
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: 'none',
                  background: uploadMode === 'file' ? 'var(--gradient-accent)' : 'rgba(255,255,255,0.05)',
                  color: uploadMode === 'file' ? '#ffffff' : 'var(--text-secondary)',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <Upload size={16} /> Device Upload
              </button>
              <button
                type="button"
                onClick={() => setUploadMode('url')}
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: 'none',
                  background: uploadMode === 'url' ? 'var(--gradient-accent)' : 'rgba(255,255,255,0.05)',
                  color: uploadMode === 'url' ? '#ffffff' : 'var(--text-secondary)',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <Link size={16} /> Google Drive / URL
              </button>
            </div>

            <form onSubmit={handleUploadPhoto} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {uploadMode === 'file' ? (
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>Select Image File from Device *</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="glass-input"
                    style={{ padding: '8px' }}
                  />
                </div>
              ) : (
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>Google Drive Link / Image URL *</label>
                  <input
                    type="url"
                    className="glass-input"
                    placeholder="https://drive.google.com/... or https://images.unsplash.com/..."
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                  />
                </div>
              )}

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>Category</label>
                <select
                  className="glass-input"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="EVENT">Summit / Event</option>
                  <option value="WORKPLACE">Workplace / Office</option>
                  <option value="CAMPUS_MEMORIES">Campus Nostalgia</option>
                  <option value="INTERNSHIP">Internship Team</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>Caption</label>
                <textarea
                  className="glass-input"
                  rows={3}
                  placeholder="Write a memory or story about this photo..."
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                />
              </div>

              {imageUrl && (
                <div style={{ textAlign: 'center' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Image Preview:</span>
                  <img src={imageUrl} alt="preview" style={{ width: '100%', maxHeight: '160px', objectFit: 'cover', borderRadius: '8px', marginTop: '6px' }} />
                </div>
              )}

              <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
                <button type="button" onClick={() => setShowUploadModal(false)} className="btn-secondary" style={{ flex: 1 }}>
                  Cancel
                </button>
                <button type="submit" className="btn-premium" style={{ flex: 1 }} disabled={submitting}>
                  {submitting ? 'Adding...' : 'Post Photo'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
